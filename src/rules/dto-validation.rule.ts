import { Rule } from 'eslint';
import { TSESTree } from '@typescript-eslint/types';

const ROUTE_DECORATORS = new Set([
    'Get',
    'Post',
    'Put',
    'Patch',
    'Delete',
    'Options',
]);
const PARAM_DECORATORS = new Set(['Body', 'Query', 'Param', 'Headers']);

function isDecoratorCall(
    decorator: TSESTree.Decorator | undefined,
    names: Set<string>,
): boolean {
    const expr = decorator?.expression;
    return (
        expr?.type === 'CallExpression' &&
        expr.callee.type === 'Identifier' &&
        names.has(expr.callee.name)
    );
}

function getTypeAnnotation(
    param: TSESTree.Parameter,
): TSESTree.TypeNode | null {
    return (param as any).typeAnnotation?.typeAnnotation ?? null;
}

function isPrimitiveType(type: TSESTree.TypeNode | null): boolean {
    return (
        !!type &&
        [
            'TSStringKeyword',
            'TSNumberKeyword',
            'TSBooleanKeyword',
            'TSAnyKeyword',
            'TSUnknownKeyword',
        ].includes(type.type)
    );
}

function isInlineTypeLiteral(type: TSESTree.TypeNode | null): boolean {
    return type?.type === 'TSTypeLiteral';
}

function isPrimitiveArray(type: TSESTree.TypeNode | null): boolean {
    return (
        type?.type === 'TSArrayType' &&
        ['TSStringKeyword', 'TSNumberKeyword', 'TSBooleanKeyword'].includes(
            type.elementType?.type,
        )
    );
}

function isInvalidReferenceType(type: TSESTree.TypeNode | null): boolean {
    if (type?.type !== 'TSTypeReference') return false;
    const name = (type.typeName as TSESTree.Identifier)?.name;
    return name === 'Record' || name === 'Map' || name === 'Object';
}

const DtoValidationRule: Rule.RuleModule = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Ensures NestJS method parameters use DTO classes instead of primitives or inline types.',
            recommended: false,
        },
        schema: [],
        messages: {
            invalidParam:
                'Invalid parameter type for NestJS request decorator. Use a DTO class instead.',
        },
    },

    create(context) {
        return {
            MethodDefinition(node: any) {
                const decorators: TSESTree.Decorator[] = node.decorators ?? [];
                const hasRoute = decorators.some((d) =>
                    isDecoratorCall(d, ROUTE_DECORATORS),
                );
                if (!hasRoute) return;

                const fn = node.value;
                if (fn.type !== 'FunctionExpression') return;

                for (const param of fn.params) {
                    if (
                        param.type !== 'Identifier' &&
                        param.type !== 'AssignmentPattern'
                    )
                        continue;

                    const paramDecorators: TSESTree.Decorator[] =
                        (param as any).decorators ?? [];

                    const hasNestParam = paramDecorators.some((d) =>
                        isDecoratorCall(d, PARAM_DECORATORS),
                    );
                    if (!hasNestParam) continue;

                    const type = getTypeAnnotation(param);

                    if (
                        !type ||
                        isPrimitiveType(type) ||
                        isInlineTypeLiteral(type) ||
                        isPrimitiveArray(type) ||
                        isInvalidReferenceType(type)
                    ) {
                        context.report({
                            node: param,
                            messageId: 'invalidParam',
                        });
                    }
                }
            },
        };
    },
};

export default DtoValidationRule;

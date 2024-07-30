// @ts-nocheck
import { Rule } from 'eslint';

const getForwardRefArgumentType = (argument: any) => {
    return argument?.arguments[0]?.body?.name;
};

const getForwardRefDecoratorAnnotationType = (parameter: any) => {
    return parameter?.typeAnnotation?.typeAnnotation.typeName?.name;
};

const IncorrectForwardRefDecoratorUsageRule: Rule.RuleModule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Incorrect usage of forwardRef decorator found',
            recommended: false,
        },
        schema: [],
        fixable: 'code',
    },
    create: (context) => {
        return {
            MethodDefinition(node) {
                if (node.kind !== 'constructor') return;

                const constructorParams = node.value.params;

                for (const param of constructorParams) {
                    const forwardRefDecorator = param.decorators.find(
                        (decorator) =>
                            decorator.expression.arguments[0].callee?.name ===
                            'forwardRef',
                    );
                    if (!forwardRefDecorator) continue;

                    const forwardRefAnnotationType =
                        getForwardRefDecoratorAnnotationType(param.parameter);
                    const forwardRefArgumentType = getForwardRefArgumentType(
                        forwardRefDecorator.expression.arguments[0],
                    );

                    if (forwardRefArgumentType !== forwardRefAnnotationType) {
                        context.report({
                            node: param,
                            message: `Incorrect use of forwardRef for: ${forwardRefArgumentType}`,
                        });
                    }
                }
            },
        };
    },
};
export default IncorrectForwardRefDecoratorUsageRule;

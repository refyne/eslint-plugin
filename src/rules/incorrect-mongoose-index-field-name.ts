import { Rule } from 'eslint';
import { flatten, isEmpty } from 'lodash';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

/**
 * Inconsistent mongoose field name found in schema
 *
 * This is the v1 version of the rule which needs a bunch of improvements
 *
 * TODO :
 * - supported nested fields for indexes (eg `{ 'address.city': 1 }` not supported yet)
 * - a class extending another base class is not supported (eg TermLoan extends BaseLoan)
 * - modify collectPropertyNames to support nested fields in return
 */
const IncorrectMongooseIndexFieldNameRule: Rule.RuleModule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Incorrect mongoose field name found in schema',
            recommended: false,
        },
        schema: [],
        fixable: 'code',
    },
    create(context) {
        const propertyNames: string[] = [];

        // Traverse the AST to find all property defination inside class declaration child nodes and collect their key names
        function collectPropertyNames(node: any) {
            const classDeclarationNodes = node.body.filter(
                // @ts-expect-error decorator is not typed
                (node) =>
                    node.declaration?.type === AST_NODE_TYPES.ClassDeclaration,
            );

            const classPropertyNodes = flatten(
                // @ts-expect-error decorator is not typed
                classDeclarationNodes.map((node) => node.declaration.body.body),
            );
            const propertyDefinitionNodes = classPropertyNodes.filter(
                // @ts-expect-error decorator is not typed
                (node) => node.type === AST_NODE_TYPES.PropertyDefinition,
            );

            for (const propertyNode of propertyDefinitionNodes) {
                // @ts-expect-error decorator is not typed
                propertyNames.push(propertyNode.key.name);
            }
        }

        return {
            Program() {
                const { ast } = context.getSourceCode();
                collectPropertyNames(ast);
            },
            CallExpression(node) {
                if (
                    // @ts-expect-error decorator is not typed
                    node.callee?.property?.name !== 'index' ||
                    isEmpty(node.arguments)
                )
                    return;

                // finding out indexes
                // @ts-expect-error decorator is not typed
                for (const property of node.arguments[0].properties) {
                    const indexFieldName =
                        property.key.value ?? property.key.name;
                    const isIndexNestedField = isEmpty(property.key.name); // not supporting nested fields for now, TODO to take it up later
                    if (
                        !isIndexNestedField &&
                        !propertyNames.includes(indexFieldName)
                    ) {
                        context.report({
                            node: node,
                            message: `Incorrect mongoose field name ${indexFieldName} found in schema`,
                        });
                    }
                }
            },
        };
    },
};
export default IncorrectMongooseIndexFieldNameRule;

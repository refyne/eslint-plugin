import { Rule } from 'eslint';
import { isEmpty } from 'lodash';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

/**
 * Incorrect mongoose field name found in schema
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

        // Traverse the AST to find all property definitions inside class declarations and collect their key names
        function collectPropertyNames(node: any) {
            // Find both exported and non-exported class declarations in the current file
            const classDeclarations: any[] = [];

            for (const child of node.body) {
                if (child.type === AST_NODE_TYPES.ClassDeclaration) {
                    classDeclarations.push(child);
                } else if (
                    (child.type === AST_NODE_TYPES.ExportNamedDeclaration ||
                        child.type ===
                            AST_NODE_TYPES.ExportDefaultDeclaration) &&
                    child.declaration &&
                    child.declaration.type === AST_NODE_TYPES.ClassDeclaration
                ) {
                    classDeclarations.push(child.declaration);
                }
            }

            // 1. Try to use native TypeScript TypeChecker (zero hardcoding solution)
            const parserServices =
                context.sourceCode.parserServices ??
                // @ts-expect-error fallback for older eslint versions
                context.parserServices;

            const hasTypeInfo =
                parserServices &&
                parserServices.program &&
                parserServices.esTreeNodeToTSNodeMap;

            if (hasTypeInfo) {
                try {
                    const typeChecker = parserServices.program.getTypeChecker();
                    const esTreeNodeToTSNodeMap =
                        parserServices.esTreeNodeToTSNodeMap;

                    for (const classDecl of classDeclarations) {
                        // Map the ES ClassDeclaration node directly to the TS Compiler node
                        const tsNode = esTreeNodeToTSNodeMap.get(classDecl);
                        if (!tsNode) continue;

                        // Retrieve the class symbol directly from the TS node or look up via its name
                        const symbol =
                            tsNode.symbol ??
                            (tsNode.name
                                ? typeChecker.getSymbolAtLocation(tsNode.name)
                                : undefined);
                        if (!symbol) continue;

                        // Get the declared instance type of the class symbol (which naturally contains all inherited fields)
                        const classType =
                            typeChecker.getDeclaredTypeOfSymbol(symbol);
                        if (!classType) continue;

                        // Retrieve all properties, including all inherited properties from any base class
                        const properties = classType.getProperties();
                        for (const prop of properties) {
                            propertyNames.push(prop.name);
                        }
                    }
                    return; // Successfully resolved using native TypeChecker
                } catch {
                    // Fallback to local AST-based search if TypeChecker lookup fails
                }
            }

            // 2. Fallback: Parse local properties if TypeChecker is unavailable
            for (const classDecl of classDeclarations) {
                if (!classDecl) continue;

                const bodyNodes = classDecl.body?.body ?? [];
                const propertyDefinitionNodes = bodyNodes.filter(
                    (member: any) =>
                        member.type === AST_NODE_TYPES.PropertyDefinition,
                );

                for (const propertyNode of propertyDefinitionNodes) {
                    const name =
                        propertyNode.key.name ?? propertyNode.key.value;
                    if (name) {
                        propertyNames.push(name);
                    }
                }
            }
        }

        return {
            Program() {
                const { ast } = context.getSourceCode();
                collectPropertyNames(ast);
            },
            CallExpression(node) {
                if (
                    // @ts-expect-error callee is not typed
                    node.callee?.property?.name !== 'index' ||
                    isEmpty(node.arguments)
                )
                    return;

                // finding out indexes
                // @ts-expect-error argument is not typed
                for (const property of node.arguments[0].properties) {
                    if (
                        !property ||
                        property.type !== 'Property' ||
                        !property.key
                    ) {
                        continue;
                    }

                    const indexFieldName: string =
                        property.key.value ?? property.key.name;

                    if (!indexFieldName) continue;

                    // Extract the root field name for nested fields (e.g., 'address.city' -> 'address')
                    const rootFieldName = indexFieldName.split('.')[0];

                    if (!propertyNames.includes(rootFieldName)) {
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

import { Rule } from 'eslint';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

const NoUnusedDependencyInjections: Rule.RuleModule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'No unused dependency injections',
            recommended: false,
        },
        schema: [],
        fixable: 'code',
    },
    create: (context) => {
        const dependencyInjects: Record<string, any> = {};
        return {
            MethodDefinition(node) {
                if (node.kind !== 'constructor') return;
                node.value.params.forEach((param) => {
                    if (param.type === AST_NODE_TYPES.Identifier) {
                        dependencyInjects[param.name] = param;
                    }
                });
            },

            MemberExpression(node) {
                if (
                    node.object.type === AST_NODE_TYPES.ThisExpression &&
                    node.property.type === AST_NODE_TYPES.Identifier &&
                    dependencyInjects[node.property.name]
                ) {
                    delete dependencyInjects[node.property.name];
                }
            },

            'Program:exit'() {
                for (const key in dependencyInjects) {
                    context.report({
                        node: dependencyInjects[key],
                        message: `Unused dependency ${key} found.`,
                    });
                }
            },
        };
    },
};

export default NoUnusedDependencyInjections;

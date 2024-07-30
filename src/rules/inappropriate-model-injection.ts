import { Rule } from 'eslint';

const InappropriateModelInjectionRule: Rule.RuleModule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Inappropriate model injection found',
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
                    // @ts-expect-error decorator is not typed
                    const injectModel = param.decorators.find(
                        // @ts-expect-error decorator is not typed
                        (decorator) =>
                            decorator.expression.callee.name === 'InjectModel',
                    );

                    if (injectModel) {
                        context.report({
                            node: node,
                            // @ts-expect-error decorator is not typed
                            message: `Inappropriate injection of model: ${param.parameter.name}`,
                        });
                    }
                }
            },
        };
    },
};
export default InappropriateModelInjectionRule;

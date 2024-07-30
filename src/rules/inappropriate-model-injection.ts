// @ts-nocheck
import { Rule } from "eslint";

const InappropriateModelInjectionRule : Rule.RuleModule = {
    meta: {
        type: "problem",
        docs: {
            description: "Inappropriate model injection found",
            recommended: false,
        },
        schema: [],
        fixable: "code",
    },
    create: (context) => {
        return {
            MethodDefinition(node) {
                if (node.kind !== "constructor") return;

                const constructorParams = node.value.params;

                for(const param of constructorParams) {
                    const injectModel = param.decorators.find(decorator => decorator.expression.callee.name === "InjectModel");
                    
                    if(injectModel){
                        context.report({
                            node: node,
                            message: `Inappropriate injection of model: ${param.parameter.name}`,
                        });
                    }
                }
            }
        }
    }
};
export default InappropriateModelInjectionRule;
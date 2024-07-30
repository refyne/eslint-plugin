// @ts-nocheck
import { Rule } from 'eslint';

const IncorrectTypeAnnotationForInjectModelRule: Rule.RuleModule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Incorrect type annotation found for Inject Model',
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
                    const injectModel = param.decorators.find(
                        (decorator) =>
                            decorator.expression.callee.name === 'InjectModel',
                    );

                    if (!injectModel) continue;

                    const typeAnnotationName =
                        param?.parameter?.typeAnnotation?.typeAnnotation
                            ?.typeName?.name;

                    if (typeAnnotationName !== 'Model') {
                        /*
                            - May have forgotten to annotate with Model
                                ### Wrong implementation
                                    @InjectModel(CommercialOd.name)
                                    private readonly commercialOdModel: CommercialOdDocument,
                                
                                ### Correction
                                    @InjectModel(CommercialOd.name)
                                    private readonly commercialOdModel: Model<CommercialOdDocument>,


                            - Corresponding constructor parameter is missing
                                ### Wrong implementation
                                    @InjectModel(CommercialOd.name)

                                ### Correction
                                    @InjectModel(CommercialOd.name)
                                    private readonly commercialOdModel: Model<CommercialOdDocument>
                        */
                        context.report({
                            node: node,
                            message: `Incorrect type annotation found for Inject Model: ${param.parameter.name}`,
                        });
                    }
                }
            },
        };
    },
};
export default IncorrectTypeAnnotationForInjectModelRule;

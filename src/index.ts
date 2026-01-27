import { recommended } from './configs/recommended';
import InconsistentMongooseTypeDeclarationRule from './rules/inconsistent-mongoose-type-declaration';
import IncorrectMongooseIndexFieldNameRule from './rules/incorrect-mongoose-index-field-name';
import InappropriateModelInjectionRule from './rules/inappropriate-model-injection';
import IncorrectTypeAnnotationForInjectModelRule from './rules/incorrect-type-annotation-for-inject-model';
import IncorrectForwardRefDecoratorUsageRule from './rules/incorrect-forward-ref-decorator-usage';
import DtoValidationRule from './rules/dto-validation.rule';
import NoUnusedDependencyInjections from './rules/no-unused-dependency-injection';

export const configs = {
    recommended,
};

export const rules = {
    'inconsistent-mongoose-type-declaration':
        InconsistentMongooseTypeDeclarationRule,
    'incorrect-mongoose-index-field-name': IncorrectMongooseIndexFieldNameRule,
    'inappropriate-model-injection': InappropriateModelInjectionRule,
    'incorrect-type-annotation-for-injection-model':
        IncorrectTypeAnnotationForInjectModelRule,
    'incorrect-forward-ref-decorator-usage':
        IncorrectForwardRefDecoratorUsageRule,
    'dto-validation': DtoValidationRule,
    'no-unused-dependency-injection': NoUnusedDependencyInjections,
};

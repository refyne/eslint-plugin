import { recommended } from './configs/recommended';
import InconsistentMongooseTypeDeclarationRule from './rules/inconsistent-mongoose-type-declaration';

export const configs = {
  recommended,
};

export const rules = {
  'inconsistent-mongoose-type-declaration':
    InconsistentMongooseTypeDeclarationRule,
};

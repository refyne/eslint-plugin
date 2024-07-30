import { isEmpty, isEqual, replace } from 'lodash';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { Rule } from 'eslint';

const getPropertiesFromArguments = (args: any) => {
  if (isEmpty(args)) return {};

  const properties = args[0].properties;

  return properties.reduce((options: any, prop: any) => {
    if (
      prop.type === AST_NODE_TYPES.Property &&
      prop.key.type === AST_NODE_TYPES.Identifier &&
      prop.value.type === AST_NODE_TYPES.Literal
    ) {
      options[prop.key.name] = prop.value.value;
    }
    return options;
  }, {});
};

const InconsistentMongooseTypeDeclarationRule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Inconsistent mongoose type declaration found in schema',
      recommended: false,
    },
    schema: [],
    fixable: 'code',
  },
  create: (context) => {
    return {
      Decorator: (node: any) => {
        if (node.expression.callee.name === 'Prop') {
          const propArguments = node.expression.arguments;

          const typeDeclaration = context.sourceCode.getText(node);
          const parentTypeDeclaration = context.sourceCode.getText(node.parent);

          const optionalMatch = parentTypeDeclaration.match(/\?:/);
          const propOptions = getPropertiesFromArguments(propArguments);

          const isMongooseTypeRequired = propOptions['required'] ?? false;
          const isTypeRequired = isEmpty(optionalMatch);

          if (!isEqual(isMongooseTypeRequired, isTypeRequired)) {
            const typeCode = replace(parentTypeDeclaration, typeDeclaration, '')
              .replace('\n', '')
              .trim(); // TODO- refactor this as per AST
            context.report({
              node: node,
              message: `Inconsistent mongoose type declaration found in schema > ${typeCode}`,
            });
          }
        }
      },
    };
  },
};

export default InconsistentMongooseTypeDeclarationRule;

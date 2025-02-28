# Refyne ESLint Plugin

The repository includes custom ESLint rules, written in TypeScript, designed to serve as guardrails. These rules help prevent errors and avoid mistakes when working with NestJS and Mongoose.

---

**File Structure**:

-   `docs/rules/` for documentation.
-   `src/rules/` for rule definitions.
-   `tests/` for tests for `src/`.

---

## Installation

Use [npm](https://www.npmjs.com/) or a compatible tool to install.

```
$ npm install --save-dev @refyne/eslint-plugin
```

### Requirements

-   Node.js v18.10.0
-   ESLint

## Usage

Modify your `.eslintrc.js`

```js
{
  plugins: ['@refyne'],
  extends: [
    'plugin:@refyne/recommended',
  ]
}
```

See also [Configuring ESLint](https://eslint.org/docs/user-guide/configuring).

## Rules

💼 Set in the `recommended` configuration.\
🔧
Automatically fixable by the
[`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡
Manually fixable by
[editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Name                                                                                                                                               | Description                                                   | 💼  | 🔧  | 💡  |
| :------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------ | :-- | :-- | :-- |
| [inconsistent-mongoose-type-declaration](https://github.com/refyne/eslint-plugin/blob/master/docs/rules/inconsistent-mongoose-type-declaration.md) | Detects inconsistent mongoose types in schema                 | ✅  |     | 💡  |
| incorrect-mongoose-index-field-name                                                                                                                | Flags incorrect mongoose index creation on non-existing field | ✅  |     |     |
| inappropriate-model-injection                                                                                                                      | Restricts model injection in certain files                    | ✅  |     |     |
| incorrect-type-annotation-for-injection-model                                                                                                      | Flags incorrect injection model type in constructor           | ✅  |     | 💡  |
| incorrect-forward-ref-decorator-usage                                                                                                              | Flags incorrect usage of forwardRef decorator in constructor  | ✅  |     | 💡  |

### Development Tools

-   `npm test` runs tests.



this is a test 
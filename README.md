## Refyne Eslint Plugin.

The repository includes custom ESLint rules, written in TypeScript, designed to serve as guardrails. These rules help prevent errors and avoid mistakes when working with NestJS and Mongoose.

---

**File Structure**:

- `docs/rules/` for documentation.
- `src/rules/` for rule definitions.
- `tests/` for tests for `src/`.

---

## Installation

Use [npm](https://www.npmjs.com/) or a compatibility tool to install.

```
$ npm install --save-dev @refyne/eslint-plugin
```

### Requirements

- Node.js v18.10.0
- ESLint

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

### Development Tools

- `npm test` runs tests.

### TODO

Modify readme to have each rule details here.

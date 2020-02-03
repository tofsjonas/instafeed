module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    semi: ['error', 'never'],
    quotes: [2, 'single'],
    indent: ['error', 2],
    'no-multi-spaces': ['error', { ignoreEOLComments: false }],
    'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    'comma-spacing': ['error', { before: false, after: true }],
    'func-call-spacing': ['error', 'never'],
    'keyword-spacing': ['error', { after: true, before: true }],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'space-infix-ops': ['error', { int32Hint: true }],
  },
}

// {
//   "parser": "@typescript-eslint/parser",
//   "plugins": ["@typescript-eslint"],
//   "rules": {
//     "semi": ["error", "never"],
//     "quotes": [2, "single"]
//   }
// }

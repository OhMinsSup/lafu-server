module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  plugins: ['@typescript-eslint', "prettier"],
  rules: {
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/no-empty-interface': 0,
    'import/first': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/prefer-interface': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-use-before-define': 0,
    'no-undef': 0,
    'no-useless-catch': 0,
    '@typescript-eslint/camelcase': 0
  }
};

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'require-await': 'warn',
    'max-lines-per-function': [
      'warn',
      { max: 50, skipBlankLines: true, skipComments: true },
    ],
    'max-depth': ['warn', 3],
    'no-lonely-if': 'error',
    'consistent-return': ['error'],
    complexity: ['warn', { max: 20 }],
  },
};

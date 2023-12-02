module.exports = {
  root: true,
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc', 'prettier'],
  rules: {
    'tsdoc/syntax': 'warn',
    'import/order': 'error',
    'no-use-before-define': 'off',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],
    'prettier/prettier': [
      'error',
      {
        tabWidth: 2,
        printWidth: 80,
        singleQuote: true,
        trailingComma: 'none',
        semi: false
      }
    ]
  }
}

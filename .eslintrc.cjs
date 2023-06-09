const { presets, configure } = require('eslint-kit');

/** @type {import('eslint-kit').Linter.Config} */
module.exports = configure({
  presets: [
    presets.imports({ sort: { newline: true } }),
    presets.typescript(),
    presets.prettier(),
    presets.react(),
    presets.node(),
  ],
  extend: {
    plugins: ['@typescript-eslint', 'prefer-let'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-let/prefer-let': 2,
      'prefer-const': 'off',
    },
  },
});

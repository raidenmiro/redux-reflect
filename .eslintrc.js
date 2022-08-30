const { configure, presets } = require('eslint-kit');
const prettierConfigStandard = require('prettier-config-standard');

module.exports = configure({
  presets: [
    presets.node(),
    presets.imports({
      sort: {
        newline: false,
      },
      alias: {
        'redux-reflect': ['./src'],
        'redux-reflect/*': ['./src/*'],
      },
    }),
    presets.typescript({
      root: '.',
      tsconfig: 'tsconfig.json',
    }),
    presets.prettier({
      ...prettierConfigStandard,
      semi: true,
      parser: 'typescript',
      singleQuote: true,
      trailingComma: 'es5',
      proseWrap: 'never',
      arrowParens: 'always',
      tabWidth: 2,
    }),
    presets.react({
      version: 'detect',
      newJSXTransform: true,
    }),
  ],
  extend: {
    rules: {
      // @fix later..
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
});

import cheminfo from 'eslint-config-cheminfo/base';
import unicorn from 'eslint-config-cheminfo/unicorn';
import globals from 'globals';

export default [
  {
    ignores: [
      'packages/*/dist',
      'packages/*/docs',
      'packages/*/examples',
      'packages/*/example',
      'packages/*/lib',
      'packages/*/lib-module',
      'packages/*/node_modules',
      'packages/chemical-groups/src/groups.js',
      'packages/chemical-groups/src/groupsObject.js',
    ],
  },
  ...cheminfo,
  ...unicorn,
  {
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      'max-lines-per-function': [
        'warn',
        {
          max: 1000,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'no-shadow': [
        'error',
        {
          builtinGlobals: true,
          hoist: 'all',
          allow: [],
        },
      ],
      'no-await-in-loop': 'off',
      'prefer-named-capture-group': 'off',
    },
  },
  {
    files: ['**/__tests__/**'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
];

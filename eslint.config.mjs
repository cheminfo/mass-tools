import cheminfo from 'eslint-config-cheminfo/base';
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
  {
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      'no-shadow': [
        'error',
        {
          builtinGlobals: true,
          hoist: 'all',
          allow: [],
        },
      ],
      'no-await-in-loop': 'warn',
      'max-lines-per-function': [
        'warn',
        {
          max: 1000,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  {
    files: ['**/__tests__/**'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
];

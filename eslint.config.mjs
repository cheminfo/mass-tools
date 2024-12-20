import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import cheminfo from 'eslint-config-cheminfo-typescript/base';
import unicorn from 'eslint-config-cheminfo-typescript/unicorn';
import globals from 'globals';

export default [
  {
    ignores: [
      'packages/*/coverage',
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
  ...createNoExtraneousConfigs(),
];

function createNoExtraneousConfigs() {
  const configs = [];
  for (const pkg of fs.readdirSync('packages')) {
    configs.push({
      files: [`packages/${pkg}/**`],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            packageDir: [
              fileURLToPath(new URL(`packages/${pkg}`, import.meta.url)),
              path.dirname(fileURLToPath(import.meta.url)),
            ],
          },
        ],
      },
    });
  }
  return configs;
}

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, globalIgnores } from 'eslint/config';
import cheminfo from 'eslint-config-cheminfo-typescript/base';
import unicorn from 'eslint-config-cheminfo-typescript/unicorn';
import vitest from 'eslint-config-cheminfo-typescript/vitest';
import globals from 'globals';

export default defineConfig(
  globalIgnores([
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
  ]),
  cheminfo,
  unicorn,
  vitest,
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
      // we manipulate trees of plain objects holding a `children` array, like
      // the taxonomy ones, that the rule mistakes for DOM elements
      'unicorn/better-dom-traversing': 'off',
    },
  },
  {
    files: ['**/__tests__/**'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
  {
    // the vitest config brings the plugin, and the rule has to be set in the
    // same object as the plugin it comes from
    files: ['**/*.test.js'],
    plugins: vitest.find((config) => config.plugins)?.plugins,
    rules: {
      // useMockServer registers the beforeAll / afterEach / afterAll that
      // isolate a test file from the network, so it has to be called while the
      // file is collected, not inside a hook
      'vitest/require-hook': [
        'error',
        { allowedFunctionCalls: ['useMockServer'] },
      ],
    },
  },
  createNoExtraneousConfigs(),
);

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

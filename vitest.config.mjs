import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      exclude: [
        'benchmark/**',
        'examples/**',
        'packages/*/lib/**',
        'packages/chemical-elements/data-original/**',
        'profiling/**',
        'src/**',
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});

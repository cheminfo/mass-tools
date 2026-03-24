import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    snapshotFormat: {
      maxOutputLength: 1e8,
    },
    coverage: {
      provider: 'istanbul',
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

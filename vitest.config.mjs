import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      exclude: ['packages/*/lib/**', ...coverageConfigDefaults.exclude],
    },
  },
});

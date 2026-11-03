import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    maxWorkers: 2,
    testTimeout: 20000,
    coverage: {
      provider: 'v8',
      include: ['middleware/**/*.js', 'routes/**/*.js'],
    },
  },
});

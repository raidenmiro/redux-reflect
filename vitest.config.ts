import { defineConfig } from 'vitest/config';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
});

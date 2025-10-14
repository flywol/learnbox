import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./src/tests/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/',
          'src/tests/',
          '**/*.test.{ts,tsx}',
          '**/*.spec.{ts,tsx}',
          '**/types/',
          '**/*.d.ts',
          '**/index.ts',
          'src/main.tsx',
          'src/App.tsx',
          'vite.config.ts',
          'vitest.config.ts',
        ],
        include: [
          'src/**/*.{ts,tsx}',
        ],
        thresholds: {
          lines: 70,
          functions: 70,
          branches: 70,
          statements: 70,
        },
      },
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    },
  })
);

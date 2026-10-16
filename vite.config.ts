import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Deployed to https://nitya-lohiya.github.io (a user site), so assets live at the root.
export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});

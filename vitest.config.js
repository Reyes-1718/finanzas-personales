import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Configuración de Vitest para tests unitarios / de caracterización.
// Solo afecta a tests/unit; NO toca la app ni vite.config.js.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.test.{js,jsx}'],
    setupFiles: ['./tests/unit/setup.js'],
  },
});

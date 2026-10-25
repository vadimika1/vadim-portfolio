/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Одна страница — рабочий стол. Обычная версия /classic/ собирается отдельно скриптом scripts/classic.ts из тех же данных.
export default defineConfig({
  plugins: [react()],
  build: { target: 'es2022', assetsInlineLimit: 0 },
  test: { include: ['tests/**/*.test.ts'] },
});

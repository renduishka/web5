import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: { rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), react: resolve(import.meta.dirname, 'lab_2_react/index.html') } } },
});

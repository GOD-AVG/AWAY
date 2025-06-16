import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Explicitly set base to root
  build: {
    outDir: 'dist', // Confirm output directory is 'dist'
  },
});

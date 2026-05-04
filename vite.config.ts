import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Set base to repo name for GitHub Pages: https://snadbreugen.github.io/tribe-contest/
export default defineConfig({
  plugins: [react()],
  base: '/tribe-contest/',
});

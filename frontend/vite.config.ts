import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

export default defineConfig({
  plugins: [sveltekit()],
  define: {
    'process.env': process.env,
  },
});

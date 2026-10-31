import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config. "host: true" lets you open the dev server from a phone on the same Wi-Fi.
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
});

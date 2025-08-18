import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // Allow HMR to work when accessed via custom hosts like crm.localhost or tenant-*.crm.localhost
    hmr: {
      clientPort: 5173,
    },
  },
});

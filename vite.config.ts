import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: 'lvh.me',
    port: 5173,
    // https: true, // Uncomment and configure as below if you need HTTPS
    // https: {
    //   key: fs.readFileSync('./cert/key.pem'),
    //   cert: fs.readFileSync('./cert/cert.pem'),
    // },
    strictPort: true,
    // Allow HMR to work when accessed via custom hosts like crm.localhost or tenant-*.crm.localhost
    hmr: {
      clientPort: 5173,
    },
  },
});

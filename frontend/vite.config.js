import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { // 👈 optimizedeps
    esbuildOptions: {
      target: "esnext",
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      supported: {
        bigint: true
      },
    }
  },

  build: {
    target: ["esnext"], // 👈 build.target
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },

})

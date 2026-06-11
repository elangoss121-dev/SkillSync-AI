import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('react-hot-toast')) {
            return 'ui-vendor';
          }
          if (id.includes('react-markdown') || id.includes('react-syntax-highlighter')) {
            return 'markdown-vendor';
          }
          if (id.includes('@monaco-editor')) {
            return 'editor-vendor';
          }
          if (id.includes('axios')) {
            return 'network-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})

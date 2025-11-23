import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/links': {
        target: 'http://localhost:9001',
        changeOrigin: true
      },
      '/new': {
        target: 'http://localhost:9001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'build'
  }
})


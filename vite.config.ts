import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reurbLivePlugin } from './vite-plugin-reurb-live'

export default defineConfig({
  plugins: [react(), reurbLivePlugin()],
  base: './',
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  preview: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})

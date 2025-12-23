import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // En dev: servir desde raíz (/); en build: usar base para GitHub Pages
  base: command === 'serve' ? '/' : '/finanzas-personales/',
  build: {
    rollupOptions: {
      output: {
        // Separamos librerías grandes para reducir el chunk inicial y permitir mejor caché
        manualChunks: {
          react: ['react', 'react-dom'],
          recharts: ['recharts'],
          crypto: ['crypto-js']
        }
      }
    }
  }
}))

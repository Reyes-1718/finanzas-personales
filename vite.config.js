import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Cambia 'finanzas-personales' por el nombre de tu repositorio en GitHub
  base: '/finanzas-personales/',
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
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Reto-Rico',
        short_name: 'Reto-Rico',
        description: 'Genera ingresos con nuestros packs de inversión',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        icons: []
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  }
})


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'prompt',
      devOptions: {
        enabled: true
      },
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        theme_color: "#ffc157e2",
        background_color: "#000000e8",
        orientation: 'portrait',
        description: 'Smart Gurbani',
        name: 'Smart Gurbani',
        icons: [
          {
            src: '/png-transparent-khanda-sikhism-religion-symbol-khanda-religious-symbol-sikh-black-and-white.png', // Provide the path to your suitable icon
            sizes: '144x144', // Set the appropriate size
            purpose: 'any' ,
            type: 'image/png',
          },
          {
            src: '/png-transparent-khanda-sikhism-religion-symbol-khanda-religious-symbol-sikh-black-and-white.png', // Provide the path to your suitable icon
            sizes: '144x144', // Set the appropriate size
            purpose: 'maskable' ,
            type: 'image/png',
          }
        ]
      }
    })
  ],
})

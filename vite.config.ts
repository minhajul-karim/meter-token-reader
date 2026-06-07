import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithms: ['brotliCompress'] }),
    compression({ algorithms: ['gzip'] }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'টোকেন রিডার – বিপিডিবি',
        short_name: 'টোকেন রিডার',
        description: 'বিপিডিবি প্রিপেইড মিটারে টোকেন দেওয়ার সহায়ক অ্যাপ',
        theme_color: '#020817',
        background_color: '#020817',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'bn',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}'],
      },
    }),
  ],
})

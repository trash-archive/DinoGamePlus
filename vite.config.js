import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'logo.png', 'logo-192.png', 'logo-512.png', 'icons.svg'],
      manifest: {
        name: 'Dino Reimagined',
        short_name: 'Dino Reimagined',
        description: 'Run, collect fossils, upgrade, and survive.',
        theme_color: '#1a1a1a',
        background_color: '#f0ede6',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: '/logo-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/logo-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // Cache all game assets
        globPatterns: ['**/*.{js,css,html,svg,png,wav,ogg,mp3}'],
        // Network-first for Supabase/Apps Script (leaderboard, feedback)
        // so online users always get fresh data, offline users get nothing (graceful)
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.hostname.includes('supabase.co') ||
              url.hostname.includes('script.google.com'),
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  build: { chunkSizeWarningLimit: 700 },
})

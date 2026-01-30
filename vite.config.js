// vite.config.js
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    outDir: 'docs',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'icons/icon-192.png',
        'icons/icon-512.png'
      ],
      manifest: {
        name: "Audio Viewer",
        short_name: "AudioViewer",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#111111",
        theme_color: "#111111",
        description: "A lightweight audio visualizer PWA built with Vite + Lit.",
        icons: [
          {
            src: "/icons/icon-192.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "/icons/icon-512.png",
            type: "image/png",
            sizes: "512x512"
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
})
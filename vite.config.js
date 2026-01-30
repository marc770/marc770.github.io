
import { VitePWA } from 'vite-plugin-pwa'

export default {
  build: {
    outDir: 'docs'
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true } // IMPORTANT for localhost
    })
  ]

};

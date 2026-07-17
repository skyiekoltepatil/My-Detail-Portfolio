import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        '.',
        '/Users/anakolte/.gemini/antigravity-ide/brain/654d7a30-8aa7-4dd2-a528-6538ae759e55',
        '/Users/anakolte/.gemini/antigravity-ide/brain/685a2c53-5220-4a0f-bae3-dbca08ebdee3'
      ]
    }
  }
})

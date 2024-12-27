import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/selfmindness/',
  plugins: [react()],
  server: {
    port: 3002, // Using port 3002 since 3000 and 3001 are taken
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['dinebuddy.in'],
    host: '0.0.0.0',
    port: 5173,
  },
})

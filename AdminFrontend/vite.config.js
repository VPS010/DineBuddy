import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'esbuild', // Ensures faster builds
    sourcemap: false, // Avoid exposing source code
  },
  define: {
    'process.env': {}, // Ensures process.env works in the frontend
  },
})

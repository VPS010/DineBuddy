import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/user/menu/',  // This tells Vite that your app is served from this path
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
  },
  define: {
    'process.env': {},
  },
})

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-green': '#1a472a',
        'gold': '#d4af37',
        'beige': '#f5f5dc',
        'maroon': '#800000',
        'metallic': '#c0c0c0'
      }
    }
  },
  plugins: []
}



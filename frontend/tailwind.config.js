/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        beige: '#F5F5DC',
        'deep-green': '#013220',
        maroon: '#800000',
      },
    },
  },
  plugins: [],
}

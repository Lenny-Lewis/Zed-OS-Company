/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          base: '#0D1B2A',
          deep: '#1B3A5E',
          card: '#183860',
          gear: '#1A4B7A',
          primary: '#2A6DB5',
          accent: '#4A9FD4',
          muted: '#BEC8D4',
        },
      },
    },
  },
  plugins: [],
}

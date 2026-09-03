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
          base: '#000000',
          surface: '#0D0D0D',
          card: '#0D0D0D',
          dark: '#000000',
          primary: '#FFFFFF',
          accent: '#38BDF8',
          muted: '#A3A3A3',
          pill: '#171717',
          gold: '#FCA311',
        },
      },
    },
  },
  plugins: [],
}

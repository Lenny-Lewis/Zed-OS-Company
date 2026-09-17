/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Instrument Serif'", 'serif'],
        body: ["'Barlow'", 'sans-serif'],
      },
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
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

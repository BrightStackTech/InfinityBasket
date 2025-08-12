/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },
      colors: {
        gold: {
          500: '#D4AF37',
          600: '#B8960C',
        },
      },
      fontFamily: {
        times: ['"Times New Roman"', 'Times', 'serif'],
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scroll-left-slow': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'scroll-left': 'scroll-left 10s linear infinite',
        'scroll-right': 'scroll-right 10s linear infinite',
        'scroll-left-slow': 'scroll-left-slow 20s linear infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
  important: true,
}

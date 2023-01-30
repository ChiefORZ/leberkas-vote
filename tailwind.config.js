const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
      colors: {
        brand: {
          DEFAULT: '#176E32',
          50: '#5FDE86',
          100: '#4EDA7A',
          200: '#2CD360',
          300: '#25B151',
          400: '#1E9041',
          500: '#176E32',
          600: '#0D401D',
          700: '#041108',
          800: '#000000',
          900: '#000000',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

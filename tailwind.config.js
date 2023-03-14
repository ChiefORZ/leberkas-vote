const { fontFamily } = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */

const backfaceVisibility = plugin(function ({ addUtilities }) {
  addUtilities({
    '.backface-visible': {
      'backface-visibility': 'visible',
      '-moz-backface-visibility': 'visible',
      '-webkit-backface-visibility': 'visible',
      '-ms-backface-visibility': 'visible',
    },
    '.backface-hidden': {
      'backface-visibility': 'hidden',
      '-moz-backface-visibility': 'hidden',
      '-webkit-backface-visibility': 'hidden',
      '-ms-backface-visibility': 'hidden',
    },
  });
});

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lexend)', ...fontFamily.sans],
        'sans-alt': ['MADE Dillan Regular', ...fontFamily.sans],
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
      gridTemplateColumns: {
        'my-grid': 'repeat(auto-fill, minmax(250px, 1fr))',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), backfaceVisibility],
};

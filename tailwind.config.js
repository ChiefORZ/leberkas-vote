const { fontFamily } = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */

const backfaceVisibility = plugin(({ addUtilities }) => {
  addUtilities({
    '.backface-hidden': {
      '-moz-backface-visibility': 'hidden',
      '-ms-backface-visibility': 'hidden',
      '-webkit-backface-visibility': 'hidden',
      'backface-visibility': 'hidden',
    },
    '.backface-visible': {
      '-moz-backface-visibility': 'visible',
      '-ms-backface-visibility': 'visible',
      '-webkit-backface-visibility': 'visible',
      'backface-visibility': 'visible',
    },
  });
});

module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [require('@tailwindcss/forms'), backfaceVisibility],
  theme: {
    extend: {
      colors: {
        brand: {
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
          DEFAULT: '#176E32',
        },
      },
      fontFamily: {
        sans: ['var(--font-lexend)', ...fontFamily.sans],
        'sans-alt': ['MADE Dillan Regular', ...fontFamily.sans],
      },
      gridTemplateColumns: {
        'my-grid': 'repeat(auto-fill, minmax(250px, 1fr))',
      },
    },
  },
};

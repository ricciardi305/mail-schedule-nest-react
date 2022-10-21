/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsla(212, 100%, 65%, 1)',
        primaryLight: 'hsla(212, 100%, 85%, 1)',
        primaryDark: 'hsla(212, 100%, 35%, 1)',
      },
    },
  },
  plugins: [],
};

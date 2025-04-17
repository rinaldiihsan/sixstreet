const flowbite = require('flowbite-react/tailwind');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', flowbite.content()],
  theme: {
    extend: {
      fontFamily: {
        garamond: ['Cormorant Garamond', 'serif'],
        overpass: ['Overpass', 'sans-serif'],
      },
      screens: {
        mobileS: '376px',
        mobile: '425px',
        tabletS: '768px',
        laptopM: '1025px',
        laptopL: '1441px',
      },
    },
  },
};

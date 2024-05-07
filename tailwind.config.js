/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        garamond: ['Cormorant Garamond', 'serif'],
        overpass: ['Overpass', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

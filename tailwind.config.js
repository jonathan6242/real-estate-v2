/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkblue: '#00335a',
        blue: '#004274',
        lightblue: '#00aeff',
        secondary: '#7a7a7a',
        background: '#f7f8f9',
        lightgray: '#DCE0E0',
        orange: '#ff6e00'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#1e1e1e',
        lightGrey: '#e6e6e6',
        red: '#f33f40',
        grey: '#636363',
        green: '#00bd31'
      },
    },

  },
  plugins: [],
}
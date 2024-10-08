/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cambria: ['Cambria', 'serif'],
        'font-sans-apple-color-emoji': ['"Font Sans"', 'Apple Color Emoji', 'sans-serif'],
      },
      colors: {
        customGreen: '#4edba1',
      },
    },
  },
  plugins: [],
}


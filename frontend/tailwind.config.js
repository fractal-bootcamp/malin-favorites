/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sixtyfour': ['"Sixtyfour Convergence"', 'sans-serif'],
        'bebas-neue': ['"Bebas Neue"', 'cursive'],
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}


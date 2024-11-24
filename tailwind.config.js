/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'shantell': ["Shantell Sans", 'sans-serif'],
      },
      boxShadow: {
        '3xl': '3px 4px 5px rgba(80, 79, 79, 0.3)',
      }
    
    },
  },
  plugins: [],
}
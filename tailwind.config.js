/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      screens:{
        '2md':'820px',
        '3md':'920px'
      }
    },
    
  },
  plugins: [],
}

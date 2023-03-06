/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      screens:{
        'sm':'601px',
        '2md':'820px',
        '3md':'920px'
      },
      colors:{
        primary: 'rgb(var(--background-default) / <alpha-value>)',
        secondary: 'rgb(var(--background-secondary) / <alpha-value>)',
        hover: 'rgb(var(--background-hover) / <alpha-value>)',
        active: 'rgb(var(--background-active) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        disabledText: 'rgb(var(--text-disabled) / <alpha-value>)',
        disabled: 'rgb(var(--background-disabled) / <alpha-value>)'
      }
    },
    
  },
  plugins: [
    'postcss-import'
],
}

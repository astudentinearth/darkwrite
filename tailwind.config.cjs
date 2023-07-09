/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/App.tsx",
            "./src/index.tsx",
            "./src/frontend/**/*"],
  darkMode: 'class',
  theme: {
    extend: {
      screens:{
        'sm':'601px',
        '2md':'820px',
        '3md':'920px'
      },
      colors:{
        base: 'rgb(var(--base) / <alpha-value>)',
        bg1: 'rgb(var(--bg1) / <alpha-value>)',
        bg2: 'rgb(var(--bg2) / <alpha-value>)',
        widget: 'rgb(var(--widget) / <alpha-value>)',
        "widget-hover": 'rgb(var(--widget-hover) / <alpha-value>)',
        "widget-active": 'rgb(var(--widget-active) / <alpha-value>)',
        "widget-disabled": 'rgb(var(--widget-disabled) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        "text-disabled": 'rgb(var(--text-disabled) / <alpha-value>)',
        "text-default": 'rgb(var(--text) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        border: 'rgb(var(--outline) / <alpha-value>)'
      }
    },
    
  },
  plugins: [
    'postcss-import'
],
}

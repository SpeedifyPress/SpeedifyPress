/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx,html}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      screens: {
        'xxl': '1436px', // custom breakpoint at 1436px
      },
      colors: {
        customBlue: {
          50: '#e6f2fb',
          100: '#cce6f7',
          200: '#99ccf0',
          300: '#66b3ea',
          400: '#3399e3',
          500: '#0080dc',
          600: '#249ce7',  // main color
          700: '#1d7bb5',
          800: '#155a83',
          900: '#0e3a52',
        },
      },      
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
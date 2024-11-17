/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {
      keyframes: {
        slideInOutRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '10%': { opacity: '1', transform: 'translateX(0)' },
          '80%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
      },
      animation: {
        slideInOutRight: 'slideInOutRight 4s ease-out forwards',
      },
      screens: {
        'mini': {'min': '500px', 'max': '634px'}
      },
    },
  },
  plugins: [],
}


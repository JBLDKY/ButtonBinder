/** @type {import('tailwindcss').Config}*/
module.exports = {
  content: ['./*.{html,js}'],
  theme: {
    extend: {
      colors: {
        gray: {
          firefoxbg: '#25212b',
        },
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin")],
}

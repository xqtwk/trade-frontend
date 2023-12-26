/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}",], theme: {
    fontFamily: {
      'sans': ['Nunito', 'sans-serif']
    }, colors: {
      light: 'rgb(208, 210, 222)',
      dark: 'rgb(26,27,33)',
      border: 'rgb(43,45,60)',
      gray: 'rgb(138, 143, 160)',
      text: 'rgb(149, 153, 180)',
      field: 'rgb(32, 33, 43)',
      darklight: 'rgb(38, 40, 54)',
      red: 'rgba(231, 76, 60, 0.8)',
      graytext: 'rgb(164, 166, 180)',
      evendarker: 'rgb(25, 26, 35)'
    }, extend: {
      width: {
        '240px': '240px',
      }
    },
  }, plugins: [],
}


module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      dropShadow: {
        'md': '8px 8px 0 #2F52E3',
      }
    },    
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

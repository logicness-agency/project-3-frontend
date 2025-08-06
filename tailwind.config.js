/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        dark: '#18181B',
        purpleGlow: '#9333ea' ,
      },
      borderRadius: {
        xl: '1.5rem',
      },
    },
  },
  plugins: [],
};

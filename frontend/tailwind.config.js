/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#073e32',
          800: '#07503c',
          700: '#0b4b3d',
          600: '#123b38',
          100: '#e3f1e7',
          50: '#eaf2e9',
        },
        cream: {
          50: '#fbfaf5',
          100: '#f2f4e9',
          200: '#e9ede0',
        },
        earth: {
          muted: '#61717e',
          border: '#e2e7e7',
          light: '#f7f9f7'
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Inter', 'system-ui', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

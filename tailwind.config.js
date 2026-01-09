/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Redefined Palette: Scholarly / Intellectual / Upper Class
        primary: {
          DEFAULT: '#002147', // Oxford Blue
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53', // Dark Blue
          900: '#102a43', // Very Dark Blue
          950: '#002147', // Oxford Blue Base
        },
        secondary: {
          DEFAULT: '#355E3B', // Hunter Green
          50: '#f2fcf5',
          100: '#e3f9e9',
          200: '#c6f2d4',
          300: '#9ceeb5',
          400: '#68e296',
          500: '#3bd27b',
          600: '#26ad60',
          700: '#355E3B', // Base
          800: '#215c3f',
          900: '#1b4d36',
        },
        accent: {
          DEFAULT: '#800020', // Burgundy
          gold: '#C5A059', // Muted Gold/Bronze
          bronze: '#CD7F32',
        },
        // Background colors
        'paper': '#F9F9F7', // Main background (Paper)
        'paper-light': '#F5F5F0', 
        'dark-academia': '#1A1A1A', // Dark mode bg
        
        // Text colors
        'ink-black': '#1A1A1A', // Primary text
        'ink-gray': '#4A4A4A', // Secondary text
        'ink-light': '#717171', // Muted text
      },
      fontFamily: {
        // Typography: Serif for Headers, Sans for Body
        serif: ['"Playfair Display"', 'Merriweather', 'serif'],
        sans: ['"Inter"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        // Sharp/Minimal corners
        'none': '0',
        'sm': '2px',
        DEFAULT: '4px',
        'md': '4px',
        'lg': '6px',
        'xl': '8px', 
        '2xl': '12px', // drastically reduced
        '3xl': '16px',
      },
      boxShadow: {
        // Minimal shadows, distinct borders
        'clean': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'float': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'sharp': '2px 2px 0px 0px rgba(0,0,0,0.1)', // Brutalist/print feel
      }
    },
  },
  plugins: [],
}

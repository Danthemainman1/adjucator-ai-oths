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
        // Core Luxury Palette (Teal, Emerald, Red, Gold)
        
        // The Gold (Unifying Accent)
        gold: {
          light: '#E6C67E',
          DEFAULT: '#C5A059', // Antique Gold
          dark: '#9F7D3D',
          metallic: '#D4AF37', // Brighter metallic
        },
        
        // Brand Primary 1: Regal Teal
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          400: '#2DD4BF',
          600: '#0D9488',
          800: '#115E59',
          900: '#0F4C5C', // Deep Luxury Teal
          950: '#042F2E',
        },
        
        // Brand Primary 2: Imperial Emerald
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          600: '#059669',
          800: '#065F46',
          900: '#1B4D3E', // British Racing Green
          950: '#064E3B',
        },
        
        // Brand Primary 3: Royal Red (Oxblood/Merlot)
        red: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          600: '#DC2626',
          800: '#991B1B',
          900: '#722F37', // Merlot
          950: '#450A0A',
        },

        // Neutrals (Supporting the Gold)
        base: {
          white: '#FFFFFF',
          cream: '#FDFBF7', // Very subtle warmth
          black: '#121212', // Rich Black
          dark: '#0A0A0A',
        },
        
        // Semantic Aliases
        primary: {
          DEFAULT: '#0F4C5C', // Teal default
          foreground: '#FFFFFF',
        },
        secondary: '#C5A059', // Gold
        accent: '#C5A059', // Gold
        
        // Text
        ink: {
          DEFAULT: '#121212',
          lighter: '#404040',
          muted: '#737373',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Merriweather', 'serif'],
        sans: ['"Inter"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'none': '0',
        'sm': '1px',
        DEFAULT: '0px', // Strict sharp corners 
        'md': '2px',
        'lg': '4px',
        'full': '9999px',
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(197, 160, 89, 0.15)', // Gold glow
        'elegant': '0 2px 5px rgba(0,0,0,0.03)', 
      }
    },
  },
  plugins: [],
}

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
        // The "Triad" of Power Colors
        teal: {
          DEFAULT: '#0f4c5c', // Deep Teal
          light: '#1a6b80',
          dark: '#08313d',
        },
        emerald: {
          DEFAULT: '#10451d', // British Racing Green / Deep Emerald
          light: '#1a6b2e',
          dark: '#052910',
        },
        red: {
          DEFAULT: '#8a1c1c', // Venetian Red / Deep Crimson
          light: '#b02e2e',
          dark: '#5c0f0f',
        },
        
        // The Unifying Accent
        gold: {
          DEFAULT: '#d4af37', // Metallic Gold
          dim: '#c5a059',      // Muted/Antique Gold
          light: '#f3e5ab',    // Champagne Gold (backgrounds)
          highlight: '#ffd700', // Bright Gold (only for tiny sparkles)
        },

        // Neutrals (Canvas)
        base: {
          white: '#ffffff',
          cream: '#faf9f6', // Off-white
          dark: '#121212',  // Rich Black
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Times New Roman', 'serif'],
        sans: ['"Inter"', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'wave-teal': 'linear-gradient(135deg, #0f4c5c 0%, #08313d 100%)',
        'wave-emerald': 'linear-gradient(135deg, #10451d 0%, #052910 100%)',
        'wave-red': 'linear-gradient(135deg, #8a1c1c 0%, #5c0f0f 100%)',
        'shine-gold': 'linear-gradient(45deg, #c5a059 0%, #d4af37 50%, #c5a059 100%)',
      },
      borderRadius: {
        DEFAULT: '2px', // Sharp, expensive feel
        'lg': '4px',
        'full': '9999px',
      },
      boxShadow: {
        'gold': '0 0 0 1px rgba(212, 175, 55, 0.3)',
        'gold-hover': '0 4px 20px rgba(212, 175, 55, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.5)',
      }
    },
  },
  plugins: [],
}

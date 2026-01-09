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
        // Sophisticated Palette
        
        // Foundations (Neutrals)
        anthracite: '#282C35', // Deep matte dark (Text/Primary Bg)
        'anthracite-light': '#3F4451',
        bone: '#F9F8F4', // Warm Off-White (Main Bg)
        greige: '#E5E4DE', // Grey-Beige (Borders/Secondary Bg)
        taupe: '#8C847E', // Warm Grey (Secondary Text)
        'mauve-taupe': '#91797B',
        pewter: '#8E9BAC', // Metallic Blue-Grey (Accents/Icons)
        
        // Primary Brand Colors
        'midnight-navy': '#0A1128', // Deepest Blue (Headers/Sidebar)
        'petrol-blue': '#1F4F59', // Rich Teal-Blue
        'slate-blue': '#5B6C86', // Muted Blue
        
        // Accents & Functional Colors
        oxblood: '#4A0404', // Deep Red (Danger/Buttons)
        cognac: '#9A463D', // Warm Brown-Red
        ochre: '#D69E2E', // Muted Gold/Yellow (Warning)
        'burnt-sienna': '#E97451',
        terracotta: '#C06C54',
        
        // Garden / Nature Tones (Success/ Info)
        sage: '#9CAF88', // Muted Green
        celadon: '#B2D3C2', // Pale Blue-Green
        verdigris: '#40826D', // Green-Blue
        'muted-chartreuse': '#B8C74A',
        aubergine: '#3B1F2B', // Deep Purple
        champagne: '#F7E7CE', 
        
        // Semantic Mapping (Aliasing to standard utilitarian names for compatibility)
        primary: {
          DEFAULT: '#0A1128', // Midnight Navy
          50: '#F0F4F8',
          100: '#D9E2EC',
          500: '#334E68',
          900: '#0A1128',
          950: '#050914',
        },
        paper: '#F9F8F4', // Bone
        ink: {
          DEFAULT: '#282C35', // Anthracite
          light: '#8C847E', // Taupe
          lighter: '#8E9BAC', // Pewter
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Merriweather', 'serif'],
        sans: ['"Inter"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'none': '0',
        'sm': '1px',
        DEFAULT: '2px', // Sharper - Editorial
        'md': '4px',
        'lg': '6px',
        'xl': '8px', 
      },
      boxShadow: {
        'clean': '0 1px 2px 0 rgba(40, 44, 53, 0.05)', // Anthracite shadow
        'float': '0 4px 12px -2px rgba(10, 17, 40, 0.1)', // Midnight shadow
      }
    },
  },
  plugins: [],
}

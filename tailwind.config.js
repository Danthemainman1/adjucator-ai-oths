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
        surface: { parchment: '#fdfcf9', card: '#f7f5ed', offset: '#e9e4d5', dark: '#11100e' },
        accent: { crimson: '#8a1c1c', hover: '#6b1515' },
        ink: { DEFAULT: '#1c1b18', light: '#fdfcf9', muted: '#5e5a52', faint: '#8b877d' },
        primary: '#8a1c1c',
        'bg-primary': '#fdfcf9',
        'bg-secondary': '#f7f5ed',
        'bg-tertiary': '#e9e4d5',
        'text-primary': '#1c1b18',
        'text-secondary': '#5e5a52',
        'text-muted': '#8b877d',
        'border-color': 'rgba(28, 27, 24, 0.12)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.4' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.65' }],
        lg: ['18px', { lineHeight: '1.65' }],
        xl: ['20px', { lineHeight: '1.5' }],
        '2xl': ['24px', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        '3xl': ['30px', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        '4xl': ['36px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '5xl': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '6xl': ['60px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      letterSpacing: { smallcaps: '0.08em' },
      boxShadow: { subtle: '0 1px 3px rgba(28, 27, 24, 0.05), 0 1px 2px rgba(28, 27, 24, 0.03)' },
      borderColor: { hairline: 'rgba(28, 27, 24, 0.12)', 'hairline-light': 'rgba(253, 252, 249, 0.15)' }
    },
  },
  plugins: [],
}

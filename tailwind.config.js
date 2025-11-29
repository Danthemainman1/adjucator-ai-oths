/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#06b6d4', // Cyan-500
          dim: 'rgba(6, 182, 212, 0.1)',
        },
        accent: {
          DEFAULT: '#8b5cf6', // Violet-500
        },
        bg: {
          primary: '#020617', // Slate-950
          secondary: '#0f172a', // Slate-900
          tertiary: '#1e293b', // Slate-800
        },
        text: {
          primary: '#f1f5f9', // Slate-100
          secondary: '#94a3b8', // Slate-400
          muted: '#64748b', // Slate-500
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

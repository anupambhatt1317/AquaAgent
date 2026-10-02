/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#063B5C',
          50: '#e6edf2',
          100: '#ccdce5',
          700: '#052f4a',
          800: '#063B5C',
          900: '#04273e',
          950: '#021624',
        },
        aqua: {
          DEFAULT: '#00A8C6',
          50: '#e0f7fa',
          100: '#b2ebf2',
          400: '#26c6da',
          500: '#00A8C6',
          600: '#00839a',
          700: '#006070',
        },
        freshGreen: {
          DEFAULT: '#43A047',
          50: '#e8f5e9',
          100: '#c8e6c9',
          400: '#66bb6a',
          500: '#43A047',
          600: '#2e7d32',
          700: '#1b5e20',
        },
        surface: {
          DEFAULT: '#F1F7F9',
          card: '#FFFFFF',
          border: '#DCE8ED',
          darkBg: '#091A28',
          darkCard: '#0E2436',
          darkBorder: '#1A3952'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

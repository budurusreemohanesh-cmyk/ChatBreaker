/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F5EF',
        paper: '#FFFFFF',
        'paper-warm': '#FAF8F3',
        ink: {
          900: '#171717',
          800: '#262626',
          700: '#404040',
          600: '#525252',
          500: '#737373',
          400: '#A3A3A3',
          300: '#D4D4D4',
          200: '#E5E5E5',
          100: '#F5F5F5',
        },
        pastel: {
          lavender: '#F3E8FF',
          'lavender-border': '#E9D5FF',
          'lavender-dark': '#7E22CE',
          green: '#DCFCE7',
          'green-border': '#BBF7D0',
          'green-dark': '#15803D',
          yellow: '#FEF9C3',
          'yellow-border': '#FEF08A',
          'yellow-dark': '#A16207',
          peach: '#FFEDD5',
          'peach-border': '#FED7AA',
          'peach-dark': '#C2410C',
          blue: '#E0F2FE',
          'blue-border': '#BAE6FD',
          'blue-dark': '#0369A1',
          pink: '#FCE7F3',
          'pink-border': '#FBCFE8',
          'pink-dark': '#BE185D',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'float': '0 12px 36px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}

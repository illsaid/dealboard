/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Archivo', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFCFA',
          100: '#FAF8F5',
          200: '#F5F2ED',
        },
        ink: {
          900: '#1A1A1A',
          800: '#2D2D2D',
          700: '#404040',
          600: '#595959',
          500: '#737373',
          400: '#8C8C8C',
          300: '#B3B3B3',
          200: '#D4D4D4',
          100: '#EBEBEB',
          50: '#F5F5F5',
        },
        // Signal red — large display, numbers, hero accents only.
        signal: {
          DEFAULT: '#EC3013',
          600: '#D62B10',
          700: '#C2260E',
        },
        // Ink red — small text, active links, selected controls, buttons.
        inkred: {
          DEFAULT: '#AE1800',
          600: '#9C1500',
          700: '#8A1300',
        },
        amber: {
          900: '#5C3D0A',
          800: '#7A510E',
          700: '#996512',
          600: '#B87A17',
          500: '#D4901E',
          400: '#E5A83D',
          300: '#F0C46A',
          200: '#F7DC9A',
          100: '#FBEDC9',
          50: '#FEF8EA',
        },
        forest: {
          900: '#0A3D1F',
          800: '#0E5129',
          700: '#126633',
          600: '#177A3D',
          500: '#1E9047',
          400: '#3DAA63',
          300: '#6AC287',
          200: '#9ADAAB',
          100: '#C9EDD4',
          50: '#EDFAF1',
        },
      },
      borderRadius: {
        // Ledger system: square corners by default.
        lg: '0',
        md: '0',
        DEFAULT: '0',
        sm: '0',
      },
    },
  },
  plugins: [],
};

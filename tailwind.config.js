/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        background: '#F7F8FA',
        surface: '#FFFFFF',
        text: '#111827',
        secondary: '#475569',
        border: '#E2E8F0',
        brand: '#2563EB',
        success: '#15803D',
        warning: '#B45309',
        danger: '#B91C1C',
        // Keep dark theme for reference (deprecated)
        dark: {
          bg: '#0D1117',
          card: '#161B22',
          border: '#30363D',
          hover: '#21262D',
          muted: '#8B949E',
          text: '#C9D1D9',
          bright: '#F0F6FC'
        },
        brand: {
          cyan: '#38BDF8',
          purple: '#818CF8',
          emerald: '#10B981',
          amber: '#F59E0B',
          coral: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        'card': '0.5rem',
        'input': '0.375rem',
      },
    },
  },
  plugins: [],
}
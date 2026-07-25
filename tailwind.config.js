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
      }
    },
  },
  plugins: [],
}

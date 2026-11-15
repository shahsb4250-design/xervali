/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f5f8',
          100: '#e8ebf0',
          500: '#1e293b',
          600: '#0f172a',
          900: '#020617'
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif']
      }
    },
  },
  plugins: [],
}

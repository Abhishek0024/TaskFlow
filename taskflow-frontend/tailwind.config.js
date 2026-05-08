/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          pink: '#f9d8e5',
          black: '#1c1c1c',
          white: '#f4f4f0',
          red: '#d9534f',
          yellow: '#f0ad4e',
          green: '#5cb85c',
        }
      },
      fontFamily: {
        mono: ['"Courier Prime"', '"Space Mono"', 'monospace'],
        sans: ['"Courier Prime"', '"Space Mono"', 'monospace'],
      },
      boxShadow: {
        brutal: '4px 4px 0px 0px rgba(28, 28, 28, 1)',
        'brutal-sm': '2px 2px 0px 0px rgba(28, 28, 28, 1)',
      }
    },
  },
  plugins: [],
}

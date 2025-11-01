/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",       // all html files in root
    "./js/**/*.js"    // your JS files
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', "Lora"],
      },
      colors: {
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          500: "#f43f5e",
          600: "#e11d48",
        },
        butter: {
          yellow: '#F8E7A0',
          cream: '#FFF9E3',
          gold: '#E6C872',
          white: '#FFFFFF',
          green: '#D6E5C6',
        },
      },
      keyframes: {
        mouseMove: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0' },
          '50%': { transform: 'translateY(12px)', opacity: '0.7' },
        },
      },
      animation: {
        mouseMove: 'mouseMove 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Warm Cream & Coral Color Palette
          cream: '#FEFCF3',      // Primary Background - Warm Cream
          coral: '#FF6B6B',      // Accent Color - Vibrant Coral
          navy: '#2C3E50',       // Text Color - Deep Navy
          gray: '#F8F9FA',       // Secondary - Soft Gray
          teal: '#20B2AA',       // Highlight - Teal Accent
          white: '#FFFFFF',      // Pure white
          // Legacy colors (keeping for backward compatibility)
          midnight: '#0F172A',
          cyan: '#06B6D4',
          blue: '#A7C7E7',
          dark: '#333333',
          lightBlue: '#E6F0F9'
        }
      },
    },
  },
  plugins: [require("daisyui")],
}

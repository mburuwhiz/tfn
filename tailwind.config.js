/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00E5FF", // Cyan/Blue Fibre accent
        secondary: "#00B8D4",
      },
    },
  },
  plugins: [],
}

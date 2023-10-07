/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
    "./index.html"
    
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  purge: [
    "./src/components/**/*.{js,jsx}",
    "./index.html",
  ],
}


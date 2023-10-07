/** @type {import('tailwindcss').Config} */
export default {
  important:true,
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
  
}


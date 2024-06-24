/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  
  // daisy UIのテーマ変更 
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
}



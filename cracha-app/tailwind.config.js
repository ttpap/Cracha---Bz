/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0A6CD4", // azul BZ
          dark: "#0732A6", // azul profundo (hover/realce)
          cyan: "#02C8E5", // ciano do gradiente
          deep: "#0423CB", // azul-marinho do gradiente
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #02C8E5 0%, #0A6CD4 45%, #0423CB 100%)",
      },
    },
  },
  plugins: [],
};

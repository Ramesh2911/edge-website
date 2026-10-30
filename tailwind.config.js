/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FBF7EF",
          card: "#FFFFFF",
          deep: "#F2EADA",
        },
        charcoal: {
          DEFAULT: "#2A2419",
          soft: "#4A4232",
          deep: "#1C1710",
        },
        gold: {
          DEFAULT: "#C8972E",
          light: "#E9D6A3",
          pale: "#F4E9CC",
          dark: "#9C7320",
        },
        olive: "#8A7B45",
        clay: "#A1463F",
        navy: "#33425C",
        plum: "#6B5A86",
        stone: {
          DEFAULT: "#6F6655",
          light: "#9A9180",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(42, 36, 25, 0.10)",
        lift: "0 16px 40px -8px rgba(42, 36, 25, 0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
}


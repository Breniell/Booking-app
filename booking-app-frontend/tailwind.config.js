/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {},
    colors: {
        primary: "#0052cc",
        secondary: "#ffbe0b",
        background: "#f5f5f5",
        text: "#333333",
      },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

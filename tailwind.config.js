// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#545454",
        secondary: "#2a2a2a",
        background: "#121212",
        text: "#ffffff",
        commonButton: "#c69f42",
        commonButtonHover: "#3a3a3a",
        commonButtonText: "#121212",
        commonButtonBorder: "#c69f42",
      },
    },
  },
  plugins: [],
};

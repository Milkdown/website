/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,css}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: '"Nunito", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      },
      colors: {
        "nord-neutral": {
          DEFAULT: "#494E59",
          dark: "#EFF1F5",
        },
        "nord-neutral-deep": {
          DEFAULT: "#2E3440",
          dark: "#ECEFF4",
        },
        "nord-dim": {
          DEFAULT: "#ABAEB3",
          dark: "#F7F9FB",
        },
        "nord-solid": {
          DEFAULT: "#636C7D",
          dark: "#D8DEE9",
        },
        "nord-primary": "#5E81AC",
        "nord-secondary": "#CFDBE7",
        "nord-secondary-deep": "#81A1C1",
        "nord-secondary-dim": "#F0F4F8",
        "nord-outline": {
          DEFAULT: "#D8DEE9",
          dark: "#434C5E",
        },
        "nord-background": {
          DEFAULT: "#ECEFF4",
          dark: "#2E3440",
        },
        "nord-foreground": {
          DEFAULT: "#FFFFFF",
          dark: "#252932",
        },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-nord"),
  ],
};

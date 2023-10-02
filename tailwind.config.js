const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgColor: "var(--theme-bg)",
        textColor: "var(--theme-text)",
        modalTextColor: "var(--theme-modal-text)",
        link: "var(--theme-link)",
        accent: "var(--theme-accent)",
        accent2: "var(--theme-accent-2)",
      },
      fontFamily: {
        // Add any custom fonts here
        sans: ['Helvetica Neue', ...fontFamily.sans],
        serif: [...fontFamily.serif],
        agrandir: ['Agrandir', ...fontFamily.sans],
        telegraf: ['Telegraf', ...fontFamily.sans],
      },
      backgroundImage: {
        'hero-bubbles': "url('/dark-bubbles.png')",
      },

    },
  },
  plugins: [],
}

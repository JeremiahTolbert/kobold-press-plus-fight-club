const defaultTheme = require("tailwindcss/defaultTheme");
const svgToDataUri = require("mini-svg-data-uri");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    
    extend: {
      fontFamily: {
        sans: ["'Open Sans'", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#104c9d',
        secondary: '#104c9d',
        kbp: {
          '50' : '#104c9d',
          '100': '#104c9d',
          '200': '#104c9d',
          '300': '#104c9d',
          '400': '#84b3f1',
          '500': '#104c9d',
          '600': '#104c9d',
          '700': '#fff',
          '800': '#163d71',
          '900': '#a3a3a3',
        },
      },
      backgroundImage: (theme) => ({
        "multiselect-caret": `none`,
        "multiselect-spinner": `url("${svgToDataUri(
          `<svg viewBox="0 0 512 512" fill="${theme(
            "colors.green.500"
          )}" xmlns="http://www.w3.org/2000/svg"><path d="M456.433 371.72l-27.79-16.045c-7.192-4.152-10.052-13.136-6.487-20.636 25.82-54.328 23.566-118.602-6.768-171.03-30.265-52.529-84.802-86.621-144.76-91.424C262.35 71.922 256 64.953 256 56.649V24.56c0-9.31 7.916-16.609 17.204-15.96 81.795 5.717 156.412 51.902 197.611 123.408 41.301 71.385 43.99 159.096 8.042 232.792-4.082 8.369-14.361 11.575-22.424 6.92z"></path></svg>`
        )}")`,
        "multiselect-remove": `none`,
      }),
    },
  },
  plugins: [require("@tailwindcss/forms"), require("flowbite/plugin"), require("@tailwindcss/typography")],
};

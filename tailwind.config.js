/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  theme: {
    screens: {
      md: "960px",
      lg: "1440px",
      xl: "1900px",
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      md: "18px",
      lg: "20px",
      xl: "28px",
      "2xl": "36px",
    },
    fontFamily: {
      noto: ["Noto Sans", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
    borderRadius: {
      none: "0px",
      sm: "5px",
      DEFAULT: "10px",
      lg: "20px",
      full: "50%",
    },
    extend: {
      colors: {
        // common
        error: "#C74E3E", // choot vs PO
        primary: "#FB973B",
        background: "#2A2C36",
        stroke: "#4F5472",
        disabled: "#9297AE",
        // text
        black: "#282626",
        "white-smoke": "#F5F5F5",
        dark: "#868896",
        "gray-placeholder": "#58606E",
        "dark-less": "#9AA0A7",
        purple: "#9FA8DE",
        "text-disabled": "#525567",
        isError: "#FF6A55",

        // button
        "gray-dark": "#898A8D",
        gray: "#3B3E52",
        "gray-light": "#5F6796",
        "gray-lightness": "#4D526E",
        "gray-blue": " #3B3E52",
        grays: "#AFAFAF",

        // border
        "gray-border": "#313546",
        "dashed-border": "#687492",
        "gray-smoke": "#6D769B",

        // background
        "body-login": "#1D1E25",
        "gray-editor": "#383B48",
      },
    },
  },
  plugins: [],
};

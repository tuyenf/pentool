// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["assets/styles/app.scss", "assets/styles/tailwind.scss"],
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "nuxt-lodash"],
  build: {
    transpile: ["vuetify"],
  },
  ssr: false,
  lodash: {
    prefix: "_",
    prefixSkip: ["string"],
    upperAfterPrefix: false,
    exclude: ["map"],
    alias: [
      ["camelCase", "stringToCamelCase"], // => stringToCamelCase
      ["kebabCase", "stringToKebab"], // => stringToKebab
      ["isDate", "isLodashDate"], // => _isLodashDate
    ],
  },
});

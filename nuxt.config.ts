// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["assets/styles/app.scss", "assets/styles/tailwind.scss"],
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt"],
  build: {
    transpile: ["vuetify"],
  },
  ssr: false,
});

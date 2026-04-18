// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: 'http://e-commerce-laravel.test/api/v1',
      storage: 'http://e-commerce-laravel.test/',
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
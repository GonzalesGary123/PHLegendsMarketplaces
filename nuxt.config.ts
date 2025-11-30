// nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/supabase', 'nuxt-auth-utils'],
  
  
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [],
    }
  },
  
  css: ['./app/assets/css/main.css'],
  
  vite: {
    plugins: [tailwindcss()],
  },
})
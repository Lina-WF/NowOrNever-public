// https://nuxt.com/docs/api/configuration/nuxt-config
import { ru } from 'vuetify/locale'

export default defineNuxtConfig({
  modules: [
    'vuetify-nuxt-module',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxtjs/apollo',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@samk-dev/nuxt-vcalendar',
    '@nuxtjs/color-mode',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Now or Never',
      link: [
        { rel: 'icon', type: 'image/jpg', href: '/logo.jpg' },
      ],
    },
  },
  css: [
    './style.css',
    'animate.css/animate.min.css',
  ],
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    passPepper: process.env.PASSWORD_PEPPER,
  },
  compatibilityDate: '2024-04-03',
  nitro: {
    experimental: {
      openAPI: true,
      websocket: true,
    },
    watchOptions: {
      ignored: ['**/data/**'],
    },
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.BASE_URL
          ? `${process.env.BASE_URL}/api/gql-server`
          : 'http://localhost:3000/api/gql-server',
        browserHttpEndpoint: '/api/gql-server',
      },
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  vuetify: {
    vuetifyOptions: {
      labComponents: true,
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#b1dae5',
              secondary: '#437aa5',
              accent: '#b12f31',
              darktext: '#021526',
              themewhite: '#e1e8ea',
              glow: '#ffffff6f',
              headfoot: '#437aa5',
              permanentDark: '#021526',
              permanentAccent: '#b12f31',
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: '#1e4461',
              secondary: '#4d9bd7',
              accent: '#cf6679',
              darktext: '#bdc6c8',
              themewhite: '#021526',
              glow: '#41729b66',
              headfoot: '#0b2e49',
              permanentDark: '#021526',
              permanentAccent: '#b12f31',
            },
          },
        },
      },
      locale: {
        locale: 'ru',
        fallback: 'en',
        messages: {
          ru: {
            ...ru,
            timePicker: {
              hour: 'Час',
              minute: 'Минута',
              am: 'AM',
              pm: 'PM',
              title: 'Выберите время',
            },
          },
        },
      },
    },
  },
})

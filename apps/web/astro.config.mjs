import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://laakapp.olanai.tech',
  output: 'static',
  env: {
    schema: {
      API_URL: envField.string({ context: 'server', access: 'secret', default: 'https://laak-api.ahmedgaber-1988-masterai.workers.dev' }),
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});

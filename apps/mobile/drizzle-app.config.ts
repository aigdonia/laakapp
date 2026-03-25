import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/app-schema.ts',
  out: './drizzle/app',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config

import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/user-schema.ts',
  out: './drizzle/user',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config

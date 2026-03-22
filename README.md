# fin-ai

Halal Wealth Visualizer — monorepo powered by Turborepo + pnpm.

## Apps

| App | Stack | Description |
|-----|-------|-------------|
| `apps/mobile` | React Native (Expo) | Portfolio tracker mobile app |
| `apps/admin` | Next.js + Tailwind | CMS + screening management dashboard |
| `apps/web` | Astro | Marketing site |
| `apps/api` | Cloudflare Workers | LLM proxy, price cron, content API |

## Packages

| Package | Description |
|---------|-------------|
| `packages/shared` | Shared types, constants, validation schemas |

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` — Start all apps in development mode
- `pnpm build` — Build all apps
- `pnpm lint` — Lint all apps
- `pnpm typecheck` — Type-check all apps

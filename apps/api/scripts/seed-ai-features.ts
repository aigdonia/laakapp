/**
 * Seed script for AI features configuration.
 * Upserts features via the API.
 *
 * Usage:
 *   npx tsx apps/api/scripts/seed-ai-features.ts --api-url http://localhost:12003 --admin-key <key>
 */

const DEFAULT_API_URL = 'http://localhost:12003'

const features = [
  {
    slug: 'narrative',
    name: 'Portfolio Narrative',
    description: 'Surface-level 3-sentence portfolio snapshot. First use costs 1 credit, subsequent refreshes are free.',
    creditCost: 1,
    freeRefresh: true,
    promptSlug: 'portfolio-narrative',
    enabled: true,
  },
  {
    slug: 'deep_analysis',
    name: 'Deep Portfolio Analysis',
    description: 'In-depth portfolio analysis with performance drivers, concentration risk, and compliance threshold proximity.',
    creditCost: 3,
    freeRefresh: false,
    promptSlug: 'portfolio-deep-analysis',
    enabled: true,
  },
  {
    slug: 'stock_deepdive',
    name: 'Stock Deep-Dive',
    description: 'Per-holding analysis with personalized intro. Batch stock analysis + real-time personalization layer.',
    creditCost: 2,
    freeRefresh: false,
    promptSlug: 'stock-deep-dive-personal',
    enabled: true,
  },
]

async function main() {
  const args = process.argv.slice(2)
  const urlIdx = args.indexOf('--api-url')
  const keyIdx = args.indexOf('--admin-key')

  const apiUrl = urlIdx >= 0 ? args[urlIdx + 1] : DEFAULT_API_URL
  const adminKey = keyIdx >= 0 ? args[keyIdx + 1] : process.env.ADMIN_API_KEY

  if (!adminKey) {
    console.error('Missing admin key. Use --admin-key <key> or set ADMIN_API_KEY env var.')
    process.exit(1)
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminKey}`,
  }

  console.log(`Seeding AI features to ${apiUrl}...`)

  const existing = await fetch(`${apiUrl}/ai-features`).then((r) => r.json()) as Array<{ id: string; slug: string }>

  for (const feature of features) {
    const match = existing.find((e) => e.slug === feature.slug)

    if (match) {
      const res = await fetch(`${apiUrl}/ai-features/${match.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(feature),
      })
      if (!res.ok) throw new Error(`Failed to update ${feature.slug}: ${res.status}`)
      console.log(`  Updated: ${feature.name} (${feature.slug})`)
    } else {
      const res = await fetch(`${apiUrl}/ai-features`, {
        method: 'POST',
        headers,
        body: JSON.stringify(feature),
      })
      if (!res.ok) throw new Error(`Failed to create ${feature.slug}: ${res.status}`)
      console.log(`  Created: ${feature.name} (${feature.slug})`)
    }
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

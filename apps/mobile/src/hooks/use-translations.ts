import { api } from '@/src/lib/api'
import { appDb } from '@/src/db'
import { cachedTranslationBundles } from '@/src/db/app-schema'
import { eq } from 'drizzle-orm'
import type {
  TranslationBundle,
  TranslationBundleResponse,
  TranslationVersionMap,
} from '@fin-ai/shared'

export async function fetchOrCacheTranslations(
  languageCode: string,
): Promise<{ bundle: TranslationBundle; version: number }> {
  // 1. Read cached bundle from SQLite
  const cached = await appDb
    .select()
    .from(cachedTranslationBundles)
    .where(eq(cachedTranslationBundles.languageCode, languageCode))
    .get()

  try {
    // 2. Check remote version
    const versions = await api.get<TranslationVersionMap>(
      '/ui-translations/versions',
    )
    const remoteVersion = versions[languageCode] ?? 0

    // 3. If cache is fresh, use it
    if (cached && cached.version >= remoteVersion) {
      return {
        bundle: JSON.parse(cached.bundle) as TranslationBundle,
        version: cached.version,
      }
    }

    // 4. Fetch fresh bundle
    const response = await api.get<TranslationBundleResponse>(
      `/ui-translations/bundle/${languageCode}`,
    )

    // 5. Write to cache
    await appDb
      .insert(cachedTranslationBundles)
      .values({
        languageCode,
        version: response.version,
        bundle: JSON.stringify(response.bundle),
        fetchedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: cachedTranslationBundles.languageCode,
        set: {
          version: response.version,
          bundle: JSON.stringify(response.bundle),
          fetchedAt: new Date(),
        },
      })

    return { bundle: response.bundle, version: response.version }
  } catch {
    // 6. Offline fallback: use cache if available
    if (cached) {
      return {
        bundle: JSON.parse(cached.bundle) as TranslationBundle,
        version: cached.version,
      }
    }
    return { bundle: {}, version: 0 }
  }
}

import type { Translations } from "@fin-ai/shared";

/**
 * Extracts translations from FormData.
 * Looks for keys like `name__ar`, `name__ms` and groups them:
 * `{ ar: { name: "أسهم" }, ms: { name: "Saham" } }`
 */
export function extractTranslations(
  form: FormData,
  fields: string[]
): Translations {
  const result: Translations = {};

  for (const [key, value] of form.entries()) {
    const sep = key.indexOf("__");
    if (sep === -1) continue;

    const field = key.slice(0, sep);
    const lang = key.slice(sep + 2);

    if (!fields.includes(field)) continue;

    const trimmed = (value as string).trim();
    if (!trimmed) continue;

    result[lang] ??= {};
    result[lang][field] = trimmed;
  }

  return result;
}

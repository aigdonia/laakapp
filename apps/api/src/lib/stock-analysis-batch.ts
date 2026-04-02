import { eq, and, desc, inArray } from "drizzle-orm";
import type { Database } from "../db";
import {
  stocks,
  stockFinancials,
  stockCompliance,
  stockAnalyses,
  prompts,
} from "../db/schema";
import { generateContent } from "./gemini";

const BATCH_SIZE = 10;
const DELAY_MS = 1000;
const LANGUAGES = ["en", "ar"] as const;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateBatchAnalyses(
  db: Database,
  apiKey: string,
  stockIds?: string[],
  all?: boolean,
): Promise<{ generated: number; errors: number }> {
  // 1. Fetch prompt template
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(eq(prompts.slug, "stock-deep-dive-batch"))
    .limit(1);

  if (!prompt || !prompt.enabled) {
    throw new Error("Prompt 'stock-deep-dive-batch' not found or disabled");
  }

  // 2. Get stocks to process
  let stockList: { id: string; symbol: string; name: string; sector: string; exchange: string }[];

  if (stockIds?.length) {
    stockList = await db
      .select({
        id: stocks.id,
        symbol: stocks.symbol,
        name: stocks.name,
        sector: stocks.sector,
        exchange: stocks.exchange,
      })
      .from(stocks)
      .where(and(eq(stocks.enabled, true), inArray(stocks.id, stockIds)));
  } else if (all) {
    stockList = await db
      .select({
        id: stocks.id,
        symbol: stocks.symbol,
        name: stocks.name,
        sector: stocks.sector,
        exchange: stocks.exchange,
      })
      .from(stocks)
      .where(eq(stocks.enabled, true));
  } else {
    // Default: stocks that don't have an analysis yet
    const existing = await db
      .select({ stockId: stockAnalyses.stockId })
      .from(stockAnalyses)
      .where(eq(stockAnalyses.languageCode, "en"));

    const existingIds = new Set(existing.map((e) => e.stockId));

    const allStocks = await db
      .select({
        id: stocks.id,
        symbol: stocks.symbol,
        name: stocks.name,
        sector: stocks.sector,
        exchange: stocks.exchange,
      })
      .from(stocks)
      .where(eq(stocks.enabled, true));

    stockList = allStocks.filter((s) => !existingIds.has(s.symbol));
  }

  let generated = 0;
  let errors = 0;

  // 3. Process in batches
  for (let i = 0; i < stockList.length; i += BATCH_SIZE) {
    const batch = stockList.slice(i, i + BATCH_SIZE);

    for (const stock of batch) {
      // Fetch latest financials
      const [financials] = await db
        .select()
        .from(stockFinancials)
        .where(eq(stockFinancials.stockId, stock.id))
        .orderBy(desc(stockFinancials.fiscalYear))
        .limit(1);

      // Fetch compliance data
      const complianceData = await db
        .select()
        .from(stockCompliance)
        .where(eq(stockCompliance.stockId, stock.id));

      const latestCompliance = complianceData[0];

      // Build user prompt with all available data
      const stockData = {
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector,
        exchange: stock.exchange,
        financials: financials
          ? {
              fiscalYear: financials.fiscalYear,
              totalAssets: financials.totalAssets,
              totalDebt: financials.totalDebt,
              cashAndEquivalents: financials.cashAndEquivalents,
              receivables: financials.receivables,
              marketCap: financials.marketCap,
              totalRevenue: financials.totalRevenue,
              nonPermissibleRevenue: financials.nonPermissibleRevenue,
            }
          : null,
        compliance: latestCompliance
          ? {
              status: latestCompliance.status,
              layer: latestCompliance.layer,
              debtRatio: latestCompliance.debtRatio,
              cashInterestRatio: latestCompliance.cashInterestRatio,
              receivablesRatio: latestCompliance.receivablesRatio,
              nonPermissibleIncomeRatio:
                latestCompliance.nonPermissibleIncomeRatio,
            }
          : null,
      };

      for (const lang of LANGUAGES) {
        try {
          const systemPrompt = prompt.systemPrompt.replaceAll(
            "{{language}}",
            lang === "ar" ? "Arabic" : "English",
          );

          const content = await generateContent(apiKey, {
            model: prompt.model,
            systemPrompt,
            userPrompt: JSON.stringify(stockData),
            maxTokens: prompt.maxTokens,
            temperature: prompt.temperature,
          });

          // Check if analysis already exists
          const [existing] = await db
            .select({ id: stockAnalyses.id, version: stockAnalyses.version })
            .from(stockAnalyses)
            .where(
              and(
                eq(stockAnalyses.stockId, stock.symbol),
                eq(stockAnalyses.languageCode, lang),
              ),
            )
            .limit(1);

          if (existing) {
            await db
              .update(stockAnalyses)
              .set({
                content: content.trim(),
                model: prompt.model,
                version: existing.version + 1,
                triggerReason: "batch_regenerate",
                updatedAt: new Date().toISOString(),
              })
              .where(eq(stockAnalyses.id, existing.id));
          } else {
            await db.insert(stockAnalyses).values({
              stockId: stock.symbol,
              languageCode: lang,
              content: content.trim(),
              model: prompt.model,
              version: 1,
              triggerReason: "initial",
            });
          }

          generated++;
        } catch {
          errors++;
        }
      }
    }

    // Rate limit between batches
    if (i + BATCH_SIZE < stockList.length) {
      await sleep(DELAY_MS);
    }
  }

  return { generated, errors };
}

import { Hono } from "hono";
import type { Env } from "../index";
import type { Database } from "../db";
import { stockAnalyses } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { generateBatchAnalyses } from "../lib/stock-analysis-batch";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

// GET /stock-analysis/:symbol — returns cached batch analysis
app.get("/:symbol", async (c) => {
  const symbol = c.req.param("symbol").toUpperCase();
  const lang = (c.req.query("lang") ?? "en") as string;

  const [analysis] = await db(c)
    .select()
    .from(stockAnalyses)
    .where(
      and(eq(stockAnalyses.stockId, symbol), eq(stockAnalyses.languageCode, lang)),
    )
    .limit(1);

  if (!analysis) {
    return c.json({ error: "not_found" }, 404);
  }

  return c.json({
    symbol,
    content: analysis.content,
    version: analysis.version,
    model: analysis.model,
    updatedAt: analysis.updatedAt,
  });
});

// POST /stock-analysis/regenerate — admin trigger for batch generation
app.post("/regenerate", async (c) => {
  const body = await c.req.json<{
    stockIds?: string[];
    all?: boolean;
  }>();

  const result = await generateBatchAnalyses(
    db(c),
    c.env.GEMINI_API_KEY,
    body.stockIds,
    body.all,
  );

  return c.json(result);
});

export default app;

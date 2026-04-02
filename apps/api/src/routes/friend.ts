import { Hono } from "hono";
import { eq } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { creditTransactions, aiFeatures } from "../db/schema";
import { getBalance, debitCredits, creditBack } from "../lib/revenuecat";
import { executors } from "../lib/ai-executors";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

app.post("/", async (c) => {
  const customerId = c.get("userId");
  const { RC_SECRET_KEY, RC_PROJECT_ID, GEMINI_API_KEY } = c.env;

  const body = await c.req.json<{
    feature: string;
    payload?: Record<string, unknown>;
    language?: string;
  }>();

  const { feature, payload = {}, language = "en" } = body;

  // 1. Validate feature
  const executor = executors[feature];
  if (!executor) {
    return c.json(
      { error: "invalid_feature", valid: Object.keys(executors) },
      400,
    );
  }

  // 2. Fetch feature config from DB
  const [featureConfig] = await db(c)
    .select()
    .from(aiFeatures)
    .where(eq(aiFeatures.slug, feature))
    .limit(1);

  if (!featureConfig || !featureConfig.enabled) {
    return c.json({ error: "feature_disabled" }, 404);
  }

  const isRefresh = featureConfig.freeRefresh && payload.isRefresh === true;
  const cost = isRefresh ? 0 : featureConfig.creditCost;

  // 3. Check balance & debit (skip for free refreshes)
  const txId = crypto.randomUUID();
  let balanceAfter: number;

  if (cost > 0) {
    let balance: number;
    try {
      balance = await getBalance(RC_SECRET_KEY, RC_PROJECT_ID, customerId);
    } catch {
      return c.json({ error: "service_unavailable" }, 503);
    }

    if (balance < cost) {
      return c.json(
        { error: "insufficient_credits", required: cost, balance },
        402,
      );
    }

    try {
      const result = await debitCredits(
        RC_SECRET_KEY,
        RC_PROJECT_ID,
        customerId,
        cost,
        txId,
      );
      balanceAfter = result.balance;
    } catch (err) {
      if (err instanceof Error && err.message === "insufficient_balance") {
        return c.json({ error: "insufficient_credits", required: cost }, 402);
      }
      return c.json({ error: "service_unavailable" }, 503);
    }
  } else {
    // Free refresh — just fetch current balance for response
    try {
      balanceAfter = await getBalance(
        RC_SECRET_KEY,
        RC_PROJECT_ID,
        customerId,
      );
    } catch {
      balanceAfter = 0;
    }
  }

  // 4. Execute AI pipeline
  let result: unknown;
  try {
    result = await executor(payload, {
      apiKey: GEMINI_API_KEY,
      db: db(c),
      customerId,
      language,
    });
  } catch {
    // 5. Refund on failure
    if (cost > 0) {
      try {
        const refund = await creditBack(
          RC_SECRET_KEY,
          RC_PROJECT_ID,
          customerId,
          cost,
          `refund:${txId}`,
        );
        balanceAfter = refund.balance;
      } catch {
        // Log refund failure but still report to client
      }

      await db(c).insert(creditTransactions).values({
        id: txId,
        customerId,
        feature: `friend:${feature}`,
        amount: cost,
        balanceAfter,
        status: "refunded",
      });
    }

    return c.json(
      { error: "execution_failed", refunded: cost > 0, balance: balanceAfter },
      500,
    );
  }

  // 6. Log transaction (only for paid features)
  if (cost > 0) {
    await db(c).insert(creditTransactions).values({
      id: txId,
      customerId,
      feature: `friend:${feature}`,
      amount: -cost,
      balanceAfter,
      status: "completed",
    });
  }

  // 7. Return result
  return c.json({
    result,
    balance: balanceAfter,
    transactionId: cost > 0 ? txId : null,
  });
});

export default app;

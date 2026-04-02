import { Hono } from "hono";
import { z } from "zod";
import { eq } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import { creditTransactions, aiFeatures, userProfiles } from "../db/schema";
import { getBalance, debitCredits, creditBack } from "../lib/revenuecat";
import { executors } from "../lib/ai-executors";
import { rateLimit } from "../middleware/rate-limit";

const friendRequestSchema = z.object({
  feature: z.string().min(1),
  payload: z.record(z.string(), z.unknown()).optional(),
  language: z.string().min(2).max(10).optional(),
});

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

app.post("/", rateLimit(10), async (c) => {
  const customerId = c.get("userId");
  const { RC_SECRET_KEY, RC_PROJECT_ID, GEMINI_API_KEY } = c.env;

  const raw = await c.req.json();
  const parsed = friendRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }

  const { feature, payload = {}, language = "en" } = parsed.data;

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
    } catch (err) {
      console.error("[friend] getBalance failed:", customerId, err instanceof Error ? err.message : err);
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
    } catch (err) {
      console.error("[friend] free refresh balance check failed:", customerId, err instanceof Error ? err.message : err);
      balanceAfter = 0;
    }
  }

  // 4. Inject user profile if feature opts in
  let enrichedPayload = payload;
  if (featureConfig.useProfile) {
    const profile = await db(c)
      .select({ answers: userProfiles.answers })
      .from(userProfiles)
      .where(eq(userProfiles.userId, customerId))
      .get();
    if (profile?.answers && Object.keys(profile.answers).length > 0) {
      enrichedPayload = { ...payload, userProfile: profile.answers };
    }
  }

  // 5. Execute AI pipeline
  let result: unknown;
  try {
    result = await executor(enrichedPayload, {
      apiKey: GEMINI_API_KEY,
      db: db(c),
      customerId,
      language,
    });
  } catch (err) {
    console.error("[friend] executor failed:", feature, err instanceof Error ? err.message : err);
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

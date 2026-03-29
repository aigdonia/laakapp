import { Hono } from "hono";
import type { Env } from "../index";
import type { Database } from "../db";
import { creditTransactions } from "../db/schema";
import { getBalance, debitCredits, creditBack } from "../lib/revenuecat";

const FEATURE_COSTS: Record<string, number> = {
  ai_portfolio_narrative: 2,
  return_simulator: 2,
  dca_calculator: 2,
  what_if_rebalancer: 3,
  purification_projector: 2,
};

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

app.post("/spend", async (c) => {
  const customerId = c.get("userId");

  const body = await c.req.json<{ feature: string; payload?: unknown }>();
  const cost = FEATURE_COSTS[body.feature];
  if (!cost) {
    return c.json({ error: "invalid_feature", valid: Object.keys(FEATURE_COSTS) }, 400);
  }

  const { RC_SECRET_KEY, RC_PROJECT_ID } = c.env;

  // 1. Check balance
  let balance: number;
  try {
    balance = await getBalance(RC_SECRET_KEY, RC_PROJECT_ID, customerId);
  } catch {
    return c.json({ error: "service_unavailable" }, 503);
  }

  if (balance < cost) {
    return c.json({ error: "insufficient_credits", required: cost, balance }, 402);
  }

  // 2. Debit
  const txId = crypto.randomUUID();
  let balanceAfter: number;
  try {
    const result = await debitCredits(RC_SECRET_KEY, RC_PROJECT_ID, customerId, cost, txId);
    balanceAfter = result.balance;
  } catch (err) {
    if (err instanceof Error && err.message === "insufficient_balance") {
      return c.json({ error: "insufficient_credits", required: cost, balance }, 402);
    }
    return c.json({ error: "service_unavailable" }, 503);
  }

  // 3. Execute feature (placeholder — will be wired to actual AI calls)
  let featureResult: unknown;
  try {
    featureResult = { ok: true, feature: body.feature };
  } catch {
    // 4. Refund on failure
    try {
      const refund = await creditBack(RC_SECRET_KEY, RC_PROJECT_ID, customerId, cost, `refund:${txId}`);
      balanceAfter = refund.balance;
    } catch {
      // Log refund failure but still report to client
    }

    await db(c).insert(creditTransactions).values({
      id: txId,
      customerId,
      feature: body.feature,
      amount: cost,
      balanceAfter,
      status: "refunded",
    });

    return c.json({ error: "execution_failed", refunded: true, balance: balanceAfter }, 500);
  }

  // 5. Log transaction
  await db(c).insert(creditTransactions).values({
    id: txId,
    customerId,
    feature: body.feature,
    amount: -cost,
    balanceAfter,
    status: "completed",
  });

  // 6. Return result
  return c.json({
    result: featureResult,
    balance: balanceAfter,
    transactionId: txId,
  });
});

export default app;

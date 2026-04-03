const RC_BASE = "https://api.revenuecat.com/v2";

function headers(secretKey: string) {
  return {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };
}

type BalanceItem = { balance: number; currency_code: string };
type BalancesResponse = { items: BalanceItem[] };

export async function getBalance(
  secretKey: string,
  projectId: string,
  customerId: string,
): Promise<number> {
  const url = `${RC_BASE}/projects/${projectId}/customers/${encodeURIComponent(customerId)}/virtual_currencies?include_empty_balances=true`;

  const res = await fetch(url, { headers: headers(secretKey) });
  if (!res.ok) throw new Error(`RC balance fetch failed: ${res.status}`);

  const data = (await res.json()) as BalancesResponse;
  const lak = data.items?.find((i) => i.currency_code === "LAK");
  return lak?.balance ?? 0;
}

type TransactionResponse = { items: BalanceItem[] };

async function adjustCredits(
  secretKey: string,
  projectId: string,
  customerId: string,
  amount: number,
  reference?: string,
): Promise<{ balance: number }> {
  const url = `${RC_BASE}/projects/${projectId}/customers/${encodeURIComponent(customerId)}/virtual_currencies/transactions`;

  const body: { adjustments: Record<string, number>; reference?: string } = {
    adjustments: { LAK: amount },
  };
  if (reference) body.reference = reference;

  const res = await fetch(url, {
    method: "POST",
    headers: headers(secretKey),
    body: JSON.stringify(body),
  });

  if (res.status === 422) {
    throw new Error("insufficient_balance");
  }
  if (!res.ok) throw new Error(`RC transaction failed: ${res.status}`);

  const data = (await res.json()) as TransactionResponse;
  const lak = data.items?.find((i) => i.currency_code === "LAK");
  return { balance: lak?.balance ?? 0 };
}

export async function debitCredits(
  secretKey: string,
  projectId: string,
  customerId: string,
  amount: number,
  reference?: string,
): Promise<{ balance: number }> {
  return adjustCredits(secretKey, projectId, customerId, -Math.abs(amount), reference);
}

export async function creditBack(
  secretKey: string,
  projectId: string,
  customerId: string,
  amount: number,
  reference?: string,
): Promise<{ balance: number }> {
  return adjustCredits(secretKey, projectId, customerId, Math.abs(amount), reference);
}

import { eq } from "drizzle-orm";
import type { Database } from "../db";
import { prompts } from "../db/schema";
import { generateContent } from "./gemini";

type ExecutorContext = {
  apiKey: string;
  db: Database;
  customerId: string;
  language: string;
};

type Executor = (
  payload: Record<string, unknown>,
  ctx: ExecutorContext,
) => Promise<unknown>;

async function fetchPrompt(db: Database, slug: string) {
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(eq(prompts.slug, slug))
    .limit(1);

  if (!prompt || !prompt.enabled) {
    throw new Error(`Prompt '${slug}' not found or disabled`);
  }
  return prompt;
}

function replaceVars(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (t, [key, val]) => t.replaceAll(`{{${key}}}`, val),
    template,
  );
}

// ─── Narrative (surface, 3 sentences) ────────────────────────

async function executeNarrative(
  payload: Record<string, unknown>,
  ctx: ExecutorContext,
): Promise<unknown> {
  const prompt = await fetchPrompt(ctx.db, "portfolio-narrative");

  const systemPrompt = replaceVars(prompt.systemPrompt, {
    language: ctx.language,
  });

  const userPrompt = JSON.stringify({
    baseCurrency: payload.baseCurrency,
    gainLossPct: payload.gainLossPct,
    classes: payload.classes,
    top: payload.top,
    compliance: payload.compliance,
  });

  const text = await generateContent(ctx.apiKey, {
    model: prompt.model,
    systemPrompt,
    userPrompt,
    maxTokens: prompt.maxTokens,
    temperature: prompt.temperature,
  });

  return {
    summary: text.trim(),
    strengths: [],
    improvements: [],
  };
}

// ─── Deep Portfolio Analysis ────────────────────────────────

async function executeDeepAnalysis(
  payload: Record<string, unknown>,
  ctx: ExecutorContext,
): Promise<unknown> {
  const prompt = await fetchPrompt(ctx.db, "portfolio-deep-analysis");

  const systemPrompt = replaceVars(prompt.systemPrompt, {
    language: ctx.language,
  });

  const userPrompt = JSON.stringify({
    holdings: payload.holdings,
    compliance: payload.compliance,
    ratios: payload.ratios,
    score: payload.score,
  });

  const text = await generateContent(ctx.apiKey, {
    model: prompt.model,
    systemPrompt,
    userPrompt,
    maxTokens: prompt.maxTokens,
    temperature: prompt.temperature,
  });

  // Parse structured response: first paragraph = summary, then strengths/improvements
  return parseDeepAnalysis(text);
}

function parseDeepAnalysis(text: string): {
  summary: string;
  strengths: string[];
  improvements: string[];
} {
  const lines = text.trim().split("\n").filter(Boolean);

  const strengths: string[] = [];
  const improvements: string[] = [];
  const summaryLines: string[] = [];

  let section: "summary" | "strengths" | "improvements" = "summary";

  for (const line of lines) {
    const lower = line.toLowerCase().trim();
    if (lower.startsWith("strengths:") || lower.startsWith("**strengths")) {
      section = "strengths";
      continue;
    }
    if (
      lower.startsWith("areas to improve:") ||
      lower.startsWith("improvements:") ||
      lower.startsWith("**areas") ||
      lower.startsWith("**improvements")
    ) {
      section = "improvements";
      continue;
    }

    const cleaned = line.replace(/^[-•*]\s*/, "").trim();
    if (!cleaned) continue;

    if (section === "summary") summaryLines.push(cleaned);
    else if (section === "strengths") strengths.push(cleaned);
    else improvements.push(cleaned);
  }

  return {
    summary: summaryLines.join(" "),
    strengths,
    improvements,
  };
}

// ─── Stock Deep-Dive (personalization layer) ─────────────────

async function executeStockDeepdive(
  payload: Record<string, unknown>,
  ctx: ExecutorContext,
): Promise<unknown> {
  const prompt = await fetchPrompt(ctx.db, "stock-deep-dive-personal");

  const systemPrompt = replaceVars(prompt.systemPrompt, {
    language: ctx.language,
  });

  // Layer 1: fetch cached batch analysis
  const batchAnalysis = payload.stockAnalysis as string | undefined;

  // Layer 2: generate personalized intro
  const userPrompt = JSON.stringify({
    userContext: payload.userContext,
    stockAnalysis: batchAnalysis ?? "",
  });

  const personalizedIntro = await generateContent(ctx.apiKey, {
    model: prompt.model,
    systemPrompt,
    userPrompt,
    maxTokens: prompt.maxTokens,
    temperature: prompt.temperature,
  });

  return {
    personalizedIntro: personalizedIntro.trim(),
    stockAnalysis: batchAnalysis ?? "",
    version: payload.version ?? 1,
  };
}

// ─── Executor map ────────────────────────────────────────────

export const executors: Record<string, Executor> = {
  narrative: executeNarrative,
  deep_analysis: executeDeepAnalysis,
  stock_deepdive: executeStockDeepdive,
};


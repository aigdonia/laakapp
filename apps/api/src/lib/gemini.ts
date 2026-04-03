const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

export class GeminiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

export interface GenerateOptions {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  maxTokens: number;
  temperature: number;
}

export async function generateContent(
  apiKey: string,
  options: GenerateOptions,
): Promise<string> {
  const { model, systemPrompt, userPrompt, maxTokens, temperature } = options;

  const url = `${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
      // Gemini 2.5+ uses thinking tokens by default which eat into maxOutputTokens.
      // Set thinkingConfig to disable or budget thinking separately.
      ...(model.includes("2.5") && {
        thinkingConfig: { thinkingBudget: 0 },
      }),
    },
  };

  console.log("[gemini] Request:", JSON.stringify({
    model,
    systemPrompt: systemPrompt.slice(0, 200) + "...",
    userPrompt: userPrompt.slice(0, 500),
    maxOutputTokens: maxTokens,
    temperature,
  }));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    throw new GeminiError("Rate limited", 429, "RATE_LIMITED");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new GeminiError(
      `Gemini API error: ${res.status} ${text}`,
      res.status,
    );
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const parts = data.candidates?.[0]?.content?.parts;
  console.log("[gemini] Response parts:", JSON.stringify(parts).slice(0, 1000));
  const text = parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text) {
    console.error("[gemini] Empty response. Raw:", JSON.stringify(data).slice(0, 500));
    throw new GeminiError("Empty response from Gemini", 500, "EMPTY_RESPONSE");
  }

  return text;
}

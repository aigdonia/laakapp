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
    },
  };

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

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiError("Empty response from Gemini", 500, "EMPTY_RESPONSE");
  }

  return text;
}

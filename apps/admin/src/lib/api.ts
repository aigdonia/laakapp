const API_URL = process.env.API_URL || "http://localhost:12003";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[api] ${options?.method ?? "GET"} ${path} → ${res.status}`, body);
    throw new ApiError(res.status, body || res.statusText);
  }
  return res.json();
}

const API_URLS = {
  local: "http://localhost:12003",
  production: "https://laak-api.ahmedgaber-1988-masterai.workers.dev",
} as const;

export type ApiEnv = keyof typeof API_URLS;

export function getApiUrl(env: ApiEnv): string {
  return API_URLS[env];
}

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
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const env = (cookieStore.get("api_env")?.value ?? "local") as ApiEnv;
  const baseUrl = API_URLS[env];

  const adminKey = process.env.ADMIN_API_KEY ?? "";
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(adminKey && { Authorization: `Bearer ${adminKey}` }),
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[api] ${options?.method ?? "GET"} ${path} → ${res.status}`, body);
    throw new ApiError(res.status, body || res.statusText);
  }
  return res.json();
}

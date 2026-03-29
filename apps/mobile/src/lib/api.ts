import { getAccessToken } from './supabase'

const API_BASE_URL = __DEV__
  ? 'http://localhost:12003'
  : 'https://laak-api.ahmedgaber-1988-masterai.workers.dev'

type RequestOptions = {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
  ) {
    super(`API error: ${status}`)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const token = await getAccessToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new ApiError(response.status, data)
  }

  return response.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  postWithHeaders: <T>(path: string, body: unknown, headers: Record<string, string>) =>
    request<T>(path, { method: 'POST', body, headers }),
}

import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config/api';

// Thin fetch wrapper used by IoTService when USE_MOCK_API is false.
// Add auth headers here later (e.g. Authorization: Bearer <token>).
export async function request<T>(
    path: string,
    options: { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown } = {}
): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: options.method ?? 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: options.body === undefined ? undefined : JSON.stringify(options.body),
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`Request failed (${response.status}).`);
        }

        return (response.status === 204 ? undefined : await response.json()) as T;
    } finally {
        clearTimeout(timer);
    }
}

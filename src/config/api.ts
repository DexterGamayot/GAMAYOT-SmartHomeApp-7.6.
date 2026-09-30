// ─────────────────────────────────────────────
// API configuration.
// While the backend is not available, USE_MOCK_API = true makes
// IoTService use its built-in simulated gateway.
// To connect the real backend: set USE_MOCK_API to false and set
// API_BASE_URL (or EXPO_PUBLIC_API_URL in a .env file).
// ─────────────────────────────────────────────
export const USE_MOCK_API = true;

export const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export const REQUEST_TIMEOUT_MS = 10000;

// Endpoint paths — adjust to match the backend contract.
export const ENDPOINTS = {
    gateway: '/gateway/connect',
    devices: '/devices',
    device: (id: number) => `/devices/${id}`,
    sensors: '/sensors/latest',
    settings: '/settings',
};

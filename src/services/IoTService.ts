import {
    AppSettings,
    Device,
    NewDevice,
    SensorData,
    defaultSettings,
    sampleDevices,
} from '../models/IoTModels';
import { ENDPOINTS, USE_MOCK_API } from '../config/api';
import { request } from './apiClient';

// ─────────────────────────────────────────────
// Activity 10 — IoT Service
// This is the bottom of the architecture:
//   Screens -> useIoT() -> IoTContext -> IoTService -> IoT API
// Screens never talk to this file directly, and never generate IoT data
// themselves — only IoTContext calls into this service.
//
// Every exported function has two paths:
//   USE_MOCK_API = true  -> simulated gateway (below, "MOCK IMPLEMENTATION")
//   USE_MOCK_API = false -> real HTTP call through apiClient
// ─────────────────────────────────────────────

// ══════════ MOCK IMPLEMENTATION (replace when backend exists) ══════════

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Chance that a simulated request fails, to exercise error handling.
const FAILURE_RATE = 0.15;

function shouldFail(rate: number = FAILURE_RATE): boolean {
    return Math.random() < rate;
}

// Acts as the "device database" on the simulated gateway/API so that
// status changes persist between calls during the app session.
let deviceStore: Device[] = sampleDevices.map((device) => ({ ...device }));
let settingsStore: AppSettings = { ...defaultSettings };
let nextDeviceId = 100;

const mock = {
    async connectGateway(): Promise<boolean> {
        await delay(1000);
        if (shouldFail(0.1)) {
            throw new Error('Unable to connect to the IoT Gateway.');
        }
        return true;
    },

    async getDevices(): Promise<Device[]> {
        await delay(1200);
        if (shouldFail()) {
            throw new Error('Unable to retrieve devices.');
        }
        return deviceStore.map((device) => ({ ...device }));
    },

    async getSensorData(): Promise<SensorData> {
        await delay(1500);
        if (shouldFail()) {
            throw new Error('Unable to retrieve sensor data.');
        }
        return {
            temperature: Math.floor(Math.random() * (32 - 18 + 1)) + 18,
            humidity: Math.floor(Math.random() * (80 - 30 + 1)) + 30,
            lightLevel: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
        };
    },

    async updateDeviceStatus(id: number, status: boolean): Promise<Device> {
        await delay(1000);
        const device = deviceStore.find((item) => item.id === id);
        if (!device) {
            throw new Error('Device not found.');
        }
        if (shouldFail()) {
            throw new Error(`Unable to update ${device.name}.`);
        }
        device.status = status;
        return { ...device };
    },

    async createDevice(input: NewDevice): Promise<Device> {
        await delay(800);
        if (shouldFail()) {
            throw new Error('Unable to add the device.');
        }
        const device: Device = { id: nextDeviceId++, status: false, ...input };
        deviceStore = [...deviceStore, device];
        return { ...device };
    },

    async deleteDevice(id: number): Promise<void> {
        await delay(800);
        if (!deviceStore.some((item) => item.id === id)) {
            throw new Error('Device not found.');
        }
        if (shouldFail()) {
            throw new Error('Unable to remove the device.');
        }
        deviceStore = deviceStore.filter((item) => item.id !== id);
    },

    async getSettings(): Promise<AppSettings> {
        await delay(300);
        return { ...settingsStore };
    },

    async updateSettings(settings: AppSettings): Promise<AppSettings> {
        await delay(300);
        settingsStore = { ...settings };
        return { ...settingsStore };
    },
};

// ══════════ PUBLIC API (used by IoTContext) ══════════

/** Connects to the IoT gateway. */
export async function connectGateway(): Promise<boolean> {
    if (USE_MOCK_API) return mock.connectGateway();
    await request<unknown>(ENDPOINTS.gateway, { method: 'POST' });
    return true;
}

/** Fetches the list of known devices. */
export async function getDevices(): Promise<Device[]> {
    if (USE_MOCK_API) return mock.getDevices();
    return request<Device[]>(ENDPOINTS.devices);
}

/** Reads the latest sensor values. */
export async function getSensorData(): Promise<SensorData> {
    if (USE_MOCK_API) return mock.getSensorData();
    return request<SensorData>(ENDPOINTS.sensors);
}

/** Sends a command to change a device's status. */
export async function updateDeviceStatus(
    id: number,
    status: boolean
): Promise<Device> {
    if (USE_MOCK_API) return mock.updateDeviceStatus(id, status);
    return request<Device>(ENDPOINTS.device(id), {
        method: 'PATCH',
        body: { status },
    });
}

/** Registers a new device. */
export async function createDevice(input: NewDevice): Promise<Device> {
    if (USE_MOCK_API) return mock.createDevice(input);
    return request<Device>(ENDPOINTS.devices, { method: 'POST', body: input });
}

/** Removes a device. */
export async function deleteDevice(id: number): Promise<void> {
    if (USE_MOCK_API) return mock.deleteDevice(id);
    await request<void>(ENDPOINTS.device(id), { method: 'DELETE' });
}

/** Loads the user's app settings. */
export async function getSettings(): Promise<AppSettings> {
    if (USE_MOCK_API) return mock.getSettings();
    return request<AppSettings>(ENDPOINTS.settings);
}

/** Saves the user's app settings. */
export async function updateSettings(
    settings: AppSettings
): Promise<AppSettings> {
    if (USE_MOCK_API) return mock.updateSettings(settings);
    return request<AppSettings>(ENDPOINTS.settings, {
        method: 'PUT',
        body: settings,
    });
}

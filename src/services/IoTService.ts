import {
    AppSettings,
    Device,
    NewDevice,
    SensorData,
    defaultSettings,
} from '../models/IoTModels';
import { ENDPOINTS } from '../config/api';
import { request } from './apiClient';

type ApiSensorReading = {
    temperature: number;
    light_level: number;
};

// App settings are currently client-side preferences. The backend has no
// settings resource, so keep them for the lifetime of the app session.
let settingsStore: AppSettings = { ...defaultSettings };

/** Connects to the IoT gateway. */
export async function connectGateway(): Promise<boolean> {
    const result = await request<{ connected: boolean }>(ENDPOINTS.gateway, {
        method: 'POST',
    });
    return result.connected;
}

/** Fetches the list of known devices. */
export function getDevices(): Promise<Device[]> {
    return request<Device[]>(ENDPOINTS.devices);
}

/** Reads and maps the latest sensor values from the backend API. */
export async function getSensorData(): Promise<SensorData> {
    const reading = await request<ApiSensorReading>(ENDPOINTS.sensorsLatest);
    return {
        temperature: reading.temperature,
        lightLevel: reading.light_level,
    };
}

/** Sends a command to change a device's status. */
export function updateDeviceStatus(
    id: number,
    status: boolean
): Promise<Device> {
    return request<Device>(ENDPOINTS.device(id), {
        method: 'PATCH',
        body: { status },
    });
}

/** Registers a new device. */
export function createDevice(input: NewDevice): Promise<Device> {
    return request<Device>(ENDPOINTS.devices, { method: 'POST', body: input });
}

/** Removes a device. */
export async function deleteDevice(id: number): Promise<void> {
    await request<void>(ENDPOINTS.device(id), { method: 'DELETE' });
}

/** Loads the session-local app settings. */
export async function getSettings(): Promise<AppSettings> {
    return { ...settingsStore };
}

/** Saves app settings for the current app session. */
export async function updateSettings(
    settings: AppSettings
): Promise<AppSettings> {
    settingsStore = { ...settings };
    return { ...settingsStore };
}

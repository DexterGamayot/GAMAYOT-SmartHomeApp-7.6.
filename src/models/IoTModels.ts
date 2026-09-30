import { Ionicons } from '@expo/vector-icons';



export type Device = {
    id: number;
    name: string;
    type: string;
    icon: keyof typeof Ionicons.glyphMap;
    status: boolean;
};

export type SensorData = {
    temperature: number;
    humidity: number;
    lightLevel: number;
};
export type NewDevice = {
    name: string;
    type: string;
    icon: keyof typeof Ionicons.glyphMap;
};

export type AppSettings = {
    notifications: boolean;
    autoConnect: boolean;
};

export const defaultSettings: AppSettings = {
    notifications: true,
    autoConnect: true,
};

// Device types the user can pick when adding a device.
export const deviceTypeOptions: NewDevice['type'][] = [
    'Smart Light',
    'Smart Fan',
    'Smart Lock',
    'Smart Plug',
];

export const deviceTypeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    'Smart Light': 'bulb-outline',
    'Smart Fan': 'sync-outline',
    'Smart Lock': 'lock-closed-outline',
    'Smart Plug': 'flash-outline',
};

export const sampleDevices: Device[] = [
    {
        id: 1,
        name: 'Living Room Light',
        type: 'Smart Light',
        icon: 'bulb-outline',
        status: true,
    },
    {
        id: 2,
        name: 'Bedroom Fan',
        type: 'Smart Fan',
        icon: 'sync-outline',
        status: false,
    },
    {
        id: 3,
        name: 'Front Door Lock',
        type: 'Smart Lock',
        icon: 'lock-closed-outline',
        status: true,
    },
];

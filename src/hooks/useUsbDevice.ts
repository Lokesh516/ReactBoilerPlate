import { useRef, useCallback, useState } from 'react';

interface UsbDeviceHook {
    connectDevice: (filters?: USBDeviceFilter[]) => Promise<USBDevice | null>;
    disconnectDevice: () => Promise<void>;
    device: USBDevice | null;
    error: string | null;
    isConnected: boolean;
}

export const useUsbDevice = (): UsbDeviceHook => {
    const deviceRef = useRef<USBDevice | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Helper to update state safely
    const updateState = () => {
        setIsConnected(!!deviceRef.current && !!deviceRef.current.opened);
    };

    /**
     * Request and connect to a USB device
     * Must be triggered by a user gesture (e.g., button click)
     */
    const connectDevice = useCallback(async (filters: USBDeviceFilter[] = []) => {
        setError(null);
        try {
            // 1. Request device
            const device = await navigator.usb.requestDevice({ filters });

            // 2. Open connection
            await device.open();

            // 3. Select configuration (usually 1)
            if (device.configuration === null) {
                await device.selectConfiguration(1);
            }

            // 4. Claim interface (usually 0)
            await device.claimInterface(0);

            deviceRef.current = device;
            updateState();

            return device;
        } catch (err: any) {
            console.error('USB Connection Error:', err);
            setError(err.message || 'Failed to connect to device');
            return null;
        }
    }, []);

    /**
     * Disconnect the current device
     */
    const disconnectDevice = useCallback(async () => {
        if (deviceRef.current) {
            try {
                await deviceRef.current.close();
            } catch (err: any) {
                console.error('USB Disconnect Error:', err);
            } finally {
                deviceRef.current = null;
                updateState();
            }
        }
    }, []);

    return {
        connectDevice,
        disconnectDevice,
        device: deviceRef.current,
        error,
        isConnected,
    };
};

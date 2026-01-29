import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearLogs } from '../store/monitoringSlice';

/**
 * Hook to batch and send system logs to the server
 * Uses navigator.sendBeacon for reliable delivery on page (tab) close
 */
export const useLogSender = () => {
    const dispatch = useAppDispatch();
    const { systemLogs, apiCalls } = useAppSelector((state) => state.monitoring);

    // Refs to hold latest state for event listeners
    const logsRef = useRef({ systemLogs, apiCalls });

    useEffect(() => {
        logsRef.current = { systemLogs, apiCalls };
    }, [systemLogs, apiCalls]);

    // Configuration
    const BATCH_INTERVAL = 30000; // 30 seconds
    const BATCH_SIZE_THRESHOLD = 20;

    /**
     * Function to flush logs to the server
     */
    const flushLogs = (logs: typeof logsRef.current) => {
        const { systemLogs, apiCalls } = logs;

        if (systemLogs.length === 0 && apiCalls.length === 0) return;

        // Prepare data - In a real app, you might want to mask PII here
        const validSystemLogs = systemLogs.filter(log => typeof log.message === 'string' && !log.message.includes('***')); // Example filter

        const payload = {
            systemLogs: validSystemLogs,
            apiCalls: apiCalls,
            timestamp: Date.now(),
        };

        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        const sent = navigator.sendBeacon('/api/logs/batch', blob);

        if (sent) {
            // Optimistically clear logs from Redux if beacon was queued
            dispatch(clearLogs());
        }
    };

    // 1. Periodic Flush
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (logsRef.current.systemLogs.length > 0 || logsRef.current.apiCalls.length > 0) {
                flushLogs(logsRef.current);
            }
        }, BATCH_INTERVAL);

        return () => clearInterval(intervalId);
    }, [dispatch]);

    // 2. Flush on Size Threshold
    useEffect(() => {
        const totalLogs = systemLogs.length + apiCalls.length;
        if (totalLogs >= BATCH_SIZE_THRESHOLD) {
            flushLogs(logsRef.current);
        }
    }, [systemLogs, apiCalls, dispatch]);

    // 3. Flush on Visibility Change (Tab Close/Hide)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                flushLogs(logsRef.current);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []); // Empty dependency array, uses ref for latest state
};

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/store/hooks';
import { logSystemEvent } from '../store/monitoringSlice';

export const useInteractionLogger = () => {
    const { i18n } = useTranslation();
    const dispatch = useAppDispatch();

    // Log Language Changes
    useEffect(() => {
        const handleLanguageChanged = (lng: string) => {
            dispatch(logSystemEvent({
                message: `Language changed to ${lng.toUpperCase()}`,
                type: 'info'
            }));
        };

        i18n.on('languageChanged', handleLanguageChanged);
        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, [i18n, dispatch]);

    // Log Button Clicks (Global Listener)
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            // Find closest button or anchor
            const clickable = target.closest('button, a');

            if (clickable) {
                const text = clickable.textContent?.trim() || clickable.getAttribute('aria-label') || 'Unknown Element';
                const tagName = clickable.tagName.toLowerCase();

                // Avoid logging clicks on layout containers if they happen to be buttons (rare but possible)
                // Filter out very long text (e.g. wrapping a whole card)
                if (text.length > 50) return;

                dispatch(logSystemEvent({
                    message: `User clicked ${tagName}: "${text}"`,
                    type: 'info'
                }));
            }
        };

        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [dispatch]);
};

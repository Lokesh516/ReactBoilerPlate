import React, { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { applyTheme } from '@/styles/theme';

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { mode } = useAppSelector((state) => state.theme);

    useEffect(() => {
        applyTheme(mode);
    }, [mode]);

    return <>{children}</>;
};

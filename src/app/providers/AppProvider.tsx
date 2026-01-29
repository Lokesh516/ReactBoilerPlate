import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/store';
import { ThemeProvider } from './ThemeProvider';
import ErrorBoundary from './ErrorBoundary';
import { useLogSender } from '@/features/monitoring/hooks/useLogSender';

interface AppProviderProps {
    children: React.ReactNode;
}



const LogManager = () => {
    useLogSender();
    return null;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <LogManager />
                <ThemeProvider>
                    <BrowserRouter>
                        {children}
                    </BrowserRouter>
                </ThemeProvider>
            </Provider>
        </ErrorBoundary>
    );
};

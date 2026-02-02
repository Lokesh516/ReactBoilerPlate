import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type MonitoringTab = 'api' | 'page-views' | 'system';

interface MonitoringContextType {
    activeTab: MonitoringTab;
    setActiveTab: (tab: MonitoringTab) => void;
}

const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

export const MonitoringProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<MonitoringTab>('api');

    return (
        <MonitoringContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </MonitoringContext.Provider>
    );
};

export const useMonitoring = () => {
    const context = useContext(MonitoringContext);
    if (!context) {
        throw new Error('useMonitoring must be used within a MonitoringProvider');
    }
    return context;
};

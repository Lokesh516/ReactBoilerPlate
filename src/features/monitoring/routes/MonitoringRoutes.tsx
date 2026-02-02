import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MonitoringDashboardContent from '../pages/MonitoringDashboard';
import { MonitoringProvider } from '../context/MonitoringContext';

const MonitoringRoutes: React.FC = () => {
    return (
        <MonitoringProvider>
            <Routes>
                <Route index element={<MonitoringDashboardContent />} />
            </Routes>
        </MonitoringProvider>
    );
};

export default MonitoringRoutes;

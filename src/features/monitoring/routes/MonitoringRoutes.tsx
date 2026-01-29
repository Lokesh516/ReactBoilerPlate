import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MonitoringDashboard from '../pages/MonitoringDashboard';

const MonitoringRoutes: React.FC = () => {
    return (
        <Routes>
            <Route index element={<MonitoringDashboard />} />
        </Routes>
    );
};

export default MonitoringRoutes;

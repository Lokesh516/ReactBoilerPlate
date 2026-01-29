import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { EiLoader } from '@/components/ui';
import { useAppSelector } from '@/store/hooks';

// Lazy load features
const Login = React.lazy(() => import('@/features/auth/routes/Login'));
const Register = React.lazy(() => import('@/features/auth/routes/Register'));
const Dashboard = React.lazy(() => import('@/features/dashboard/routes/Dashboard'));
const MonitoringRoutes = React.lazy(() => import('@/features/monitoring/routes/MonitoringRoutes'));
const UserManagement = React.lazy(() => import('@/features/admin/routes/UserManagement'));

const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center">
        <EiLoader size="xl" text="Loading..." />
    </div>
);

const ProtectedRoute = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

const PublicRoute = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/monitoring/*" element={<MonitoringRoutes />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    {/* Add more protected routes here */}
                </Route>

                {/* 404 */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Suspense>
    );
};

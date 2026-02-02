import React, { useState, useEffect } from 'react';
import { Menu, LogOut, User, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { logPageView } from '@/features/monitoring/store/monitoringSlice';
import { useInteractionLogger } from '@/features/monitoring/hooks/useInteractionLogger';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAppSelector((state) => state.auth);

    // Desktop Collapsed State
    const [isCollapsed, setIsCollapsed] = useState(false);
    // Mobile Open State
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { isInstallable, isStandalone, handleInstall } = usePWAInstall();

    useInteractionLogger();

    useEffect(() => {
        const pageTitle = document.title || 'Unknown Page';
        dispatch(logPageView({
            path: location.pathname,
            title: pageTitle,
        }));
    }, [location.pathname, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };



    return (
        <div className="flex h-screen overflow-hidden bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] transition-colors duration-300">

            {/* Sidebar (Desktop & Mobile) */}
            <Sidebar
                isCollapsed={isCollapsed}
                mobileMenuOpen={mobileMenuOpen}
                toggleSidebar={toggleSidebar}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden animate-fade-in"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>

                {/* Header (Desktop & Mobile) */}
                <header className="h-20 flex items-center justify-between px-4 lg:px-8 bg-[rgba(var(--color-bg-secondary),0.8)] backdrop-blur-md border-b border-[rgb(var(--color-border))] sticky top-0 z-30">

                    {/* Left Side: Mobile Menu Toggle or Placeholder */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Right Side: Options (User, Install, Theme, Lang) */}
                    <div className="flex items-center gap-3 lg:gap-4">

                        {/* Install App Button (Hidden on very small screens if crowded) */}
                        {isInstallable && !isStandalone && (
                            <button
                                onClick={handleInstall}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-soft transition-all duration-200 hover:shadow-glow hover:-translate-y-0.5"
                            >
                                <Download className="w-4 h-4" />
                                <span className="text-sm font-semibold">Install</span>
                            </button>
                        )}

                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

                        <ThemeSwitcher />
                        <LanguageSwitcher />

                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                        {/* User Profile & Logout */}
                        <div className="flex items-center gap-3 pl-2">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                                    {user?.role || 'User'}
                                </span>
                            </div>

                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 border-2 border-white dark:border-gray-800 shadow-sm">
                                <User className="w-5 h-5" />
                            </div>

                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-red-500 transition-colors"
                                title={t('nav.logout')}
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="grid container mx-auto p-4 md:p-8 max-w-7xl animate-fade-in">
                        {children}
                    </div>

                    {/* Footer */}
                    <footer className="py-6 px-8 border-t border-gray-200/50 dark:border-gray-800/50 mt-auto">
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                            © {new Date().getFullYear()} Enhancesys Innovation. {t('footer.rights')}
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
};

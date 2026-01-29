import React, { useState, useEffect } from 'react';
import { Menu, LogOut, User, Download, X, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { logPageView } from '@/features/monitoring/store/monitoringSlice';
import { useInteractionLogger } from '@/features/monitoring/hooks/useInteractionLogger';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { NAVIGATION_ITEMS } from '@/config/navigation';

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

    const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
        const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
        return (
            <Link
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                title={isCollapsed ? label : ''}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                    ${isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                `}
            >
                <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />

                {/* Text Label - Hidden when collapsed */}
                {!isCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden transition-all duration-300">
                        {label}
                    </span>
                )}

                {/* Active Indicator Arrow - Hidden when collapsed */}
                {!isCollapsed && isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        {label}
                    </div>
                )}
            </Link>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] transition-colors duration-300">

            {/* Sidebar (Desktop & Mobile) */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 bg-[rgba(var(--color-bg-secondary),0.9)] backdrop-blur-xl border-r border-[rgb(var(--color-border))] 
                    transition-all duration-300 ease-in-out flex flex-col
                    ${isCollapsed ? 'w-20' : 'w-72'}
                    ${mobileMenuOpen ? 'translate-x-0 shadow-2xl w-72' : '-translate-x-full lg:translate-x-0 lg:shadow-none'}
                `}
            >
                {/* Logo Area */}
                <div className={`h-20 flex items-center ${isCollapsed && !mobileMenuOpen ? 'justify-center px-0' : 'px-6'} border-b border-[rgb(var(--color-border))] transition-all duration-300`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <span className="text-white dark:text-gray-900 font-bold text-xl">Ei</span>
                        </div>

                        {(!isCollapsed || mobileMenuOpen) && (
                            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-text-primary))] to-[rgb(var(--color-text-secondary))] whitespace-nowrap transition-opacity duration-300">
                                Enhancesys
                            </h1>
                        )}
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden ml-auto p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-[rgb(var(--color-text-secondary))]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-2 custom-scrollbar">
                    {/* Menu Label - Hide when collapsed */}
                    {(!isCollapsed || mobileMenuOpen) && (
                        <div className="text-xs font-semibold text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider mb-2 px-3 fade-in">
                            Menu
                        </div>
                    )}

                    {NAVIGATION_ITEMS.filter(item => user && item.roles.includes(user.role)).map((item) => (
                        <NavItem
                            key={item.path}
                            to={item.path}
                            icon={item.icon}
                            label={t(item.label)}
                        />
                    ))}
                </div>

                {/* Collapse Toggle Button (Desktop Only) */}
                <div className="hidden lg:flex items-center justify-center p-4 border-t border-[rgb(var(--color-border))]">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-[rgb(var(--color-bg-tertiary))] text-[rgb(var(--color-text-secondary))] hover:text-primary-600 transition-colors"
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                    </button>
                </div>
            </aside>

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
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {user?.firstName || 'User'}
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

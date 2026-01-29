import React, { useState } from 'react';
import { Menu, LogOut, User, LayoutDashboard, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { logPageView } from '@/features/monitoring/store/monitoringSlice';
import { useInteractionLogger } from '@/features/monitoring/hooks/useInteractionLogger';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Download } from 'lucide-react';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAppSelector((state) => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isInstallable, isStandalone, handleInstall } = usePWAInstall();

    useInteractionLogger();

    React.useEffect(() => {
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

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-40 glass-strong border-b border-white/20 dark:border-gray-700/50 shadow-md">
                <div className="container-custom">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow">
                                <span className="text-dark font-bold text-xl">Ei</span>
                            </div>
                            <h1 className="text-xl font-bold gradient-text hidden sm:block">
                                Enhancesys Innovation
                            </h1>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            <div className="flex items-center gap-1">
                                <Link
                                    to="/"
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${location.pathname === '/'
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>{t('nav.dashboard')}</span>
                                </Link>
                                <Link
                                    to="/dashboard/monitoring"
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${location.pathname.startsWith('/dashboard/monitoring')
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Activity className="w-4 h-4" />
                                    <span>{t('nav.monitoring')}</span>
                                </Link>
                            </div>

                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('nav.welcome', { name: user?.firstName || 'User' })}
                                </span>
                            </div>

                            <ThemeSwitcher />
                            <LanguageSwitcher />

                            {isInstallable && !isStandalone && (
                                <button
                                    onClick={handleInstall}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white shadow-soft transition-all duration-200 hover:shadow-glow hover:-translate-y-0.5"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Install App</span>
                                </button>
                            )}

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:shadow-md"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">{t('nav.logout')}</span>
                            </button>
                        </div>

                        {/* Mobile & Tablet Install Button (More visible) */}
                        <div className="flex md:hidden items-center gap-2">
                            {isInstallable && !isStandalone && (
                                <button
                                    onClick={handleInstall}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white shadow-soft transition-all duration-200"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Install</span>
                                </button>
                            )}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-white/20 dark:border-gray-700/50 animate-slide-down">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('nav.welcome', { name: user?.firstName || 'User' })}
                                    </span>
                                </div>

                                <div className="space-y-1 py-2 border-b border-gray-100 dark:border-gray-800">
                                    <Link
                                        to="/"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${location.pathname === '/'
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                            : 'text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>{t('nav.dashboard')}</span>
                                    </Link>
                                    <Link
                                        to="/dashboard/monitoring"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${location.pathname.startsWith('/dashboard/monitoring')
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                            : 'text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        <Activity className="w-4 h-4" />
                                        <span>{t('nav.monitoring')}</span>
                                    </Link>
                                </div>

                                <div className="flex items-center justify-between px-3 py-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('nav.language')}</span>
                                    <LanguageSwitcher />
                                </div>

                                <div className="flex items-center justify-between px-3 py-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('nav.theme')}</span>
                                    <ThemeSwitcher />
                                </div>

                                {isInstallable && !isStandalone && (
                                    <button
                                        onClick={() => {
                                            handleInstall();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-600 text-white shadow-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span className="text-sm font-medium">Install App</span>
                                    </button>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm font-medium">{t('nav.logout')}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 container-custom py-8 animate-fade-in">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="container-custom py-6">
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} Enhancesys Innovation. {t('footer.rights')}
                    </p>
                </div>
            </footer>
        </div>
    );
};

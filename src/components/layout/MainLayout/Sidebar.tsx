import React from 'react';
import { X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { NAVIGATION_ITEMS } from '@/config/navigation';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
    isCollapsed: boolean;
    mobileMenuOpen: boolean;
    toggleSidebar: () => void;
    setMobileMenuOpen: (open: boolean) => void;
}

/**
 * Sidebar Component
 * Responsible for rendering the application logo, the recursive navigation menu, and the collapse toggle.
 */
export const Sidebar: React.FC<SidebarProps> = ({
    isCollapsed,
    mobileMenuOpen,
    toggleSidebar,
    setMobileMenuOpen
}) => {
    const { t } = useTranslation();
    const { user } = useAppSelector((state) => state.auth);

    return (
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
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 custom-scrollbar">
                {/* Menu Label - Hide when collapsed */}
                {(!isCollapsed || mobileMenuOpen) && (
                    <div className="text-xs font-semibold text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider mb-2 px-3 fade-in">
                        {t('nav.menu')}
                    </div>
                )}

                <div className="space-y-1">
                    {NAVIGATION_ITEMS.filter(item => user && item.roles.includes(user.role)).map((item) => (
                        <SidebarItem
                            key={item.path}
                            item={item}
                            isCollapsed={isCollapsed && !mobileMenuOpen} // Only fully collapse on desktop
                            t={t}
                            onItemClick={() => setMobileMenuOpen(false)}
                        />
                    ))}
                </div>
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
    );
};

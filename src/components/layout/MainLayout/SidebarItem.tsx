import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { NavigationItem } from '@/config/navigation';

interface SidebarItemProps {
    item: NavigationItem;
    isCollapsed: boolean;
    depth?: number;
    t: (key: string) => string;
    onItemClick: () => void;
}

/**
 * Recursive Sidebar Item Component
 * Handles rendering of menu items and their submenus recursively.
 * scalable to any depth (though UI typically supports 2-3 levels well).
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({
    item,
    isCollapsed,
    depth = 0,
    t,
    onItemClick
}) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Check if this item or any of its children is currently active
    const isActive = (path: string) => {
        if (path.includes('?')) {
            const [basePath, query] = path.split('?');
            return location.pathname === basePath && location.search === `?${query}`;
        }
        return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    };
    const isChildActive = item.children?.some(child => isActive(child.path));
    const isItemActive = isActive(item.path);

    // Auto-expand if a child is active
    useEffect(() => {
        if (isChildActive) {
            setIsOpen(true);
        }
    }, [location.pathname, isChildActive]);

    const Icon = item.icon as LucideIcon;
    const hasChildren = item.children && item.children.length > 0;

    // Indentation for nested items (Scalability: Logical padding start)
    // Using inline style for dynamic depth calculation, or could use Tailwind classes if depth is limited
    const paddingStart = depth === 0 ? '0.75rem' : `${depth * 1 + 0.75}rem`;

    const handleClick = (e: React.MouseEvent) => {
        if (hasChildren && !isCollapsed) {
            e.preventDefault();
            setIsOpen(!isOpen);
        } else {
            onItemClick();
        }
    };

    if (isCollapsed && depth > 0) return null; // Don't show submenus in collapsed state for now (could implement popover later)

    return (
        <div className="mb-1">
            <Link
                to={hasChildren ? '#' : item.path}
                onClick={handleClick}
                style={{ paddingInlineStart: isCollapsed ? '0.75rem' : paddingStart }}
                className={`
                    flex items-center gap-3 py-3 px-3 rounded-xl transition-all duration-200 group relative
                    ${(isItemActive || (hasChildren && isChildActive && !isOpen)) // Highlight parent if child active but closed
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? t(item.label) : ''}
            >
                <Icon className={`w-6 h-6 shrink-0 transition-colors ${(isItemActive || isChildActive)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                    }`} />

                {!isCollapsed && (
                    <>
                        <span className="flex-1 whitespace-nowrap overflow-hidden text-sm">
                            {t(item.label)}
                        </span>

                        {hasChildren && (
                            <span className="ml-auto text-gray-400">
                                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </span>
                        )}

                        {/* Active Indicator Arrow */}
                        {!hasChildren && isItemActive && <ChevronRight className="w-4 h-4 opacity-50 text-current" />}
                    </>
                )}

                {/* Tooltip for collapsed state (Top-level only) */}
                {isCollapsed && depth === 0 && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        {t(item.label)}
                    </div>
                )}
            </Link>

            {/* Recursive Submenu Rendering */}
            {!isCollapsed && hasChildren && isOpen && (
                <div className="mt-1 transition-all duration-300 ease-in-out origin-top">
                    {item.children!.map((child) => (
                        <SidebarItem
                            key={child.path}
                            item={child}
                            isCollapsed={isCollapsed}
                            depth={depth + 1}
                            t={t}
                            onItemClick={onItemClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

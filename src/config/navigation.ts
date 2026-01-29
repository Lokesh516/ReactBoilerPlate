import { LayoutDashboard, Activity, Users } from 'lucide-react';

export interface NavigationItem {
    label: string;
    path: string;
    icon: React.ElementType; // Using React.ElementType to type the icon component
    roles: ('admin' | 'user' | 'superadmin')[]; // Roles allowed to see this item
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        label: 'nav.dashboard', // Using translation key
        path: '/dashboard',
        icon: LayoutDashboard,
        roles: ['admin', 'user', 'superadmin'],
    },
    {
        label: 'nav.monitoring',
        path: '/monitoring',
        icon: Activity,
        roles: ['admin', 'superadmin'], // Also simulate admin seeing this? Or just 'admin'?
    },
    {
        label: 'User Management',
        path: '/admin/users',
        icon: Users,
        roles: ['superadmin'],
    },
];

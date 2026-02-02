import { LayoutDashboard, Activity, Users, FileText, AlertTriangle } from 'lucide-react';

export interface NavigationItem {
    label: string;
    path: string;
    icon: React.ElementType;
    roles: ('admin' | 'user' | 'superadmin')[];
    children?: NavigationItem[]; // Scalable: Support for nested submenus
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        label: 'nav.dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        roles: ['admin', 'user', 'superadmin'],
    },
    {
        label: 'nav.monitoring',
        path: '/monitoring',
        icon: Activity,
        roles: ['admin', 'superadmin'],
        children: [
            {
                label: 'nav.apiLogs',
                path: '/monitoring?view=api',
                icon: FileText,
                roles: ['admin', 'superadmin'],
            },
            {
                label: 'nav.pageViews',
                path: '/monitoring?view=page-views',
                icon: FileText,
                roles: ['admin', 'superadmin'],
            },
            {
                label: 'nav.systemHealth',
                path: '/monitoring?view=system',
                icon: AlertTriangle,
                roles: ['admin', 'superadmin'],
            }
        ]
    },
    {
        label: 'User Management',
        path: '/admin/users',
        icon: Users,
        roles: ['superadmin'],
    },
];


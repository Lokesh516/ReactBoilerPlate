import React, { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { EiDataGrid } from '@/components/ui';
import type { Column } from '@/components/ui/EiDataGrid/EiDataGrid';
import type { Follower } from '../types';

export const FollowersTable: React.FC = () => {
    const { t } = useTranslation();
    const { items, isLoading } = useAppSelector((state: RootState) => state.followers);

    const columns: Column<Follower>[] = useMemo(() => [
        {
            field: 'avatar_url',
            headerName: t('table.avatar'),
            width: 100,
            renderCell: (row) => (
                <img
                    src={row.avatar_url}
                    alt={row.login}
                    className="w-10 h-10 rounded-full ring-2 ring-theme-border"
                />
            ),
        },
        {
            field: 'login',
            headerName: t('table.username'),
            width: 200,
            sortable: true,
            renderCell: (row) => (
                <span className="font-medium text-theme-text-primary">
                    {row.login}
                </span>
            ),
        },
        {
            field: 'id',
            headerName: t('table.id'),
            width: 150,
            sortable: true,
        },
        {
            field: 'html_url',
            headerName: t('table.profile'),
            flex: 1,
            renderCell: (row) => (
                <a
                    href={row.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                >
                    {t('table.viewProfile')}
                    <ExternalLink className="w-4 h-4" />
                </a>
            ),
        },
    ], [t]);

    return (
        <EiDataGrid
            title={t('dashboard.followers')}
            columns={columns}
            rows={items}
            loading={isLoading}
            height={500}
        />
    );
};

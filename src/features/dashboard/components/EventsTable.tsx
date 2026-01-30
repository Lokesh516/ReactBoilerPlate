import React, { useMemo } from 'react';
import { ExternalLink, GitBranch, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { EiDataGrid } from '@/components/ui';
import type { Column } from '@/components/ui/EiDataGrid/EiDataGrid';

interface Event {
    id: string;
    type: string;
    actor: {
        login: string;
        avatar_url: string;
    };
    repo: {
        name: string;
        url: string;
    };
    created_at: string;
}

export const EventsTable: React.FC = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useAppSelector((state: RootState) => state.dashboard);

    const events = data?.events || [];

    const columns: Column<Event>[] = useMemo(() => [
        {
            field: 'type',
            headerName: t('table.type'),
            width: 120,
            sortable: true,
            renderCell: (row) => (
                <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-theme-text-tertiary" />
                    <span className="font-medium text-theme-text-primary">
                        {row.type.replace('Event', '')}
                    </span>
                </div>
            ),
        },
        {
            field: 'actor',
            headerName: t('table.actor'),
            width: 200,
            sortable: true,
            renderCell: (row) => (
                <div className="flex items-center gap-2">
                    <img
                        src={row.actor.avatar_url}
                        alt={row.actor.login}
                        className="w-6 h-6 rounded-full"
                    />
                    <span className="text-theme-text-primary">
                        {row.actor.login}
                    </span>
                </div>
            ),
        },
        {
            field: 'repo',
            headerName: t('table.repository'),
            width: 250,
            sortable: true,
            renderCell: (row) => (
                <a
                    href={row.repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                >
                    {row.repo.name}
                </a>
            ),
        },
        {
            field: 'created_at',
            headerName: t('table.createdAt'),
            width: 180,
            sortable: true,
            renderCell: (row) => (
                <div className="flex items-center gap-2 text-theme-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>
                        {new Date(row.created_at).toLocaleDateString()}
                    </span>
                </div>
            ),
        },
        {
            field: 'actions',
            headerName: t('table.actions'),
            width: 120,
            renderCell: (row) => (
                <button
                    className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                    onClick={() => console.log('View event:', row.id)}
                >
                    {t('table.view')}
                    <ExternalLink className="w-4 h-4" />
                </button>
            ),
        },
    ], [t]);

    return (
        <EiDataGrid
            title={t('dashboard.events')}
            columns={columns}
            rows={events}
            loading={isLoading}
            height={400}
        />
    );
};

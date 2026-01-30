import React, { useMemo } from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { EiDataGrid } from '@/components/ui';
import type { Column } from '@/components/ui/EiDataGrid/EiDataGrid';

interface Feed {
    id: string;
    title: string;
    content: string;
    published_at: string;
}

export const FeedsTable: React.FC = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useAppSelector((state: RootState) => state.dashboard);

    const feeds = data?.feeds || [];

    const columns: Column<Feed>[] = useMemo(() => [
        {
            field: 'title',
            headerName: t('table.title'),
            width: 250,
            sortable: true,
            renderCell: (row) => (
                <span className="font-medium text-theme-text-primary">
                    {row.title}
                </span>
            ),
        },
        {
            field: 'content',
            headerName: t('table.content'),
            flex: 1,
            renderCell: (row) => (
                <div className="text-theme-text-secondary line-clamp-2">
                    {row.content}
                </div>
            ),
        },
        {
            field: 'published_at',
            headerName: t('table.publishedAt'),
            width: 180,
            sortable: true,
            renderCell: (row) => (
                <div className="flex items-center gap-2 text-theme-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>
                        {new Date(row.published_at).toLocaleDateString()}
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
                    onClick={() => console.log('View feed:', row.id)}
                >
                    {t('table.view')}
                    <ExternalLink className="w-4 h-4" />
                </button>
            ),
        },
    ], [t]);

    return (
        <EiDataGrid
            title={t('dashboard.feeds')}
            columns={columns}
            rows={feeds}
            loading={isLoading}
            height={400}
        />
    );
};

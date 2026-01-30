import React, { useMemo } from 'react';
import { Copy, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { EiDataGrid } from '@/components/ui';
import type { Column } from '@/components/ui/EiDataGrid/EiDataGrid';

interface Emoji {
    emoji: string;
    name: string;
    category: string;
}

export const EmojisTable: React.FC = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useAppSelector((state: RootState) => state.dashboard);

    const emojis = data?.emojis || [];

    const columns: Column<Emoji>[] = useMemo(() => [
        {
            field: 'emoji',
            headerName: t('table.emoji'),
            width: 100,
            renderCell: (row) => (
                <span className="text-2xl text-center block">
                    {row.emoji}
                </span>
            ),
        },
        {
            field: 'name',
            headerName: t('table.name'),
            width: 200,
            sortable: true,
            renderCell: (row) => (
                <span className="font-medium text-theme-text-primary">
                    {row.name}
                </span>
            ),
        },
        {
            field: 'category',
            headerName: t('table.category'),
            width: 150,
            sortable: true,
            renderCell: (row) => (
                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-theme-text-tertiary" />
                    <span className="text-theme-text-secondary capitalize">
                        {row.category}
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
                    onClick={() => {
                        navigator.clipboard.writeText(row.emoji);
                        console.log('Copied emoji:', row.emoji);
                    }}
                >
                    {t('table.copy')}
                    <Copy className="w-4 h-4" />
                </button>
            ),
        },
    ], [t]);

    return (
        <EiDataGrid
            title={t('dashboard.emojis')}
            columns={columns}
            rows={emojis}
            loading={isLoading}
            height={400}
        />
    );
};

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { EiDataGrid, type Column } from '@/components/ui/EiDataGrid/EiDataGrid';
import type { ApiCall } from '@/features/monitoring/types';


const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (status >= 500) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const Chip = ({ label, className }: { label: string | number; className: string }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {label}
    </span>
);

const ApiLogs: React.FC = () => {
    const { t } = useTranslation();
    const { apiCalls } = useAppSelector((state) => state.monitoring);

    const columns: Column<ApiCall>[] = useMemo(() => [
        { field: 'id', headerName: t('monitoring.dashboard.tabs.api') || 'ID', width: 220 },
        {
            field: 'status',
            headerName: t('monitoring.dashboard.tabs.api'),
            width: 100,
            renderCell: (row) => (
                <Chip
                    label={row.status || 'N/A'}
                    className={getStatusColor(row.status)}
                />
            )
        },
        { field: 'url', headerName: t('monitoring.dashboard.tabs.api'), width: 300, flex: 1 },
        {
            field: 'duration',
            headerName: t('monitoring.dashboard.tabs.api'),
            width: 120,
            renderCell: (row) => `${row.duration}ms`
        },
        {
            field: 'timestamp',
            headerName: t('monitoring.dashboard.tabs.api'),
            width: 200,
            renderCell: (row) => new Date(row.timestamp).toLocaleString()
        },
    ], [t]);

    return (
        <div style={{ height: 600, width: '100%' }}>
            <EiDataGrid
                rows={apiCalls}
                columns={columns}
                pageSize={10}
                loading={false}
                getRowId={(row) => row.id || Math.random()}
            />
        </div>
    );
};

export default ApiLogs;

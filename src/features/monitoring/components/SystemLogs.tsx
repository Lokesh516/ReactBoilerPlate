import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { EiDataGrid, type Column } from '@/components/ui/EiDataGrid/EiDataGrid';
import { EiCard } from '@/components/ui/EiCard/EiCard';
import type { SystemLog } from '@/features/monitoring/types';

const getLogColor = (type: string) => {
    switch (type) {
        case 'info': return 'text-blue-600 dark:text-blue-400';
        case 'warning': return 'text-yellow-600 dark:text-yellow-400';
        case 'error': return 'text-red-600 dark:text-red-400';
        case 'success': return 'text-green-600 dark:text-green-400';
        default: return 'text-gray-600 dark:text-gray-400';
    }
};

const SystemLogs: React.FC = () => {
    const { t } = useTranslation();
    const { systemLogs } = useAppSelector((state) => state.monitoring);

    const columns: Column<SystemLog>[] = useMemo(() => [
        {
            field: 'timestamp',
            headerName: t('monitoring.dashboard.tabs.system') || 'Time',
            width: 200,
            renderCell: (row) => new Date(row.timestamp).toLocaleString()
        },
        {
            field: 'type',
            headerName: t('monitoring.dashboard.tabs.system') || 'Type',
            width: 120,
            renderCell: (row) => (
                <span className={`uppercase font-bold text-xs ${getLogColor(row.type)}`}>
                    {row.type}
                </span>
            )
        },
        {
            field: 'message',
            headerName: t('monitoring.dashboard.tabs.system') || 'Message',
            width: 400,
            flex: 1
        },
    ], [t]);

    return (
        <EiCard title={t('monitoring.systemLogs.title')} subheader={t('monitoring.systemLogs.subheader')}>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-md">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">
                            {t('monitoring.systemLogs.allSystemsOperational')}
                        </span>
                    </div>
                </div>

                <div style={{ height: 500, width: '100%' }}>
                    <EiDataGrid
                        rows={systemLogs}
                        columns={columns}
                        pageSize={10}
                        getRowId={(row) => row.id}
                    />
                </div>
            </div>
        </EiCard>
    );
};

export default SystemLogs;

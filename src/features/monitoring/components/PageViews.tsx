import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { EiDataGrid, type Column } from '@/components/ui/EiDataGrid/EiDataGrid';
import type { PageView } from '@/features/monitoring/types';
import { EiCard } from '@/components/ui/EiCard/EiCard';

const PageViews: React.FC = () => {
    const { t } = useTranslation();
    const { pageViews } = useAppSelector((state) => state.monitoring);

    const rows = useMemo(() => {
        return Object.values(pageViews).map(pv => ({
            ...pv,
            id: pv.path // DataGrid needs an ID
        }));
    }, [pageViews]);

    const columns: Column<PageView>[] = useMemo(() => [
        { field: 'path', headerName: t('monitoring.dashboard.tabs.pageViews'), width: 250, flex: 1 },
        { field: 'title', headerName: t('monitoring.dashboard.tabs.pageViews'), width: 250 },
        { field: 'count', headerName: t('monitoring.dashboard.tabs.pageViews'), width: 120 },
        {
            field: 'timestamp',
            headerName: t('monitoring.dashboard.tabs.pageViews'),
            width: 200,
            renderCell: (row) => new Date(row.timestamp).toLocaleString()
        },
    ], [t]);

    return (
        <EiCard title={t('monitoring.dashboard.tabs.pageViews')} subheader={t('monitoring.dashboard.tabs.pageViews')}>
            <div style={{ height: 600, width: '100%' }}>
                <EiDataGrid
                    rows={rows}
                    columns={columns}
                    height={600}
                    pageSize={10}
                    getRowId={(row) => row.path}
                />
            </div>
        </EiCard>
    );
};

export default PageViews;

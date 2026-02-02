import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout/MainLayout';
import { EiCard } from '@/components/ui/EiCard/EiCard';
import { EiButton } from '@/components/ui/EiButton/EiButton';
import ApiLogs from '../components/ApiLogs';
import PageViews from '../components/PageViews';
import SystemLogs from '../components/SystemLogs';
import { useMonitoring } from '../context/MonitoringContext';
import type { MonitoringTab } from '../context/MonitoringContext';

const MonitoringDashboardContent: React.FC = () => {
    const { t } = useTranslation();
    const { activeTab, setActiveTab } = useMonitoring();
    const [searchParams, setSearchParams] = useSearchParams();

    // Sync URL -> Context
    useEffect(() => {
        const view = searchParams.get('view') as MonitoringTab;
        if (view && ['api', 'page-views', 'system'].includes(view)) {
            setActiveTab(view);
        } else if (!view) {
            // Default to API if no param, and update URL
            setSearchParams({ view: 'api' }, { replace: true });
            setActiveTab('api');
        }
    }, [searchParams, setActiveTab, setSearchParams]);

    // Sync Context -> URL (Active Tab Click)
    const handleTabChange = (tab: MonitoringTab) => {
        setActiveTab(tab);
        setSearchParams({ view: tab });
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold dark:text-white">{t('monitoring.dashboard.title')}</h1>

                <EiCard>
                    <div className="flex space-x-2 border-b dark:border-gray-700 pb-2 mb-4">
                        <EiButton
                            variant={activeTab === 'api' ? 'primary' : 'ghost'}
                            onClick={() => handleTabChange('api')}
                        >
                            {t('monitoring.dashboard.tabs.api')}
                        </EiButton>
                        <EiButton
                            variant={activeTab === 'page-views' ? 'primary' : 'ghost'}
                            onClick={() => handleTabChange('page-views')}
                        >
                            {t('monitoring.dashboard.tabs.pageViews')}
                        </EiButton>
                        <EiButton
                            variant={activeTab === 'system' ? 'primary' : 'ghost'}
                            onClick={() => handleTabChange('system')}
                        >
                            {t('monitoring.dashboard.tabs.system')}
                        </EiButton>
                    </div>

                    <div className="mt-4">
                        {activeTab === 'api' && <ApiLogs />}
                        {activeTab === 'page-views' && <PageViews />}
                        {activeTab === 'system' && <SystemLogs />}
                    </div>
                </EiCard>
            </div>
        </MainLayout>
    );
};

export default MonitoringDashboardContent;

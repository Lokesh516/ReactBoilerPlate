import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/MainLayout/MainLayout';
import { EiCard } from '@/components/ui/EiCard/EiCard';
import { EiButton } from '@/components/ui/EiButton/EiButton';
import ApiLogs from '../components/ApiLogs';
import PageViews from '../components/PageViews';
import SystemLogs from '../components/SystemLogs';

type Tab = 'api' | 'page-views' | 'system';

const MonitoringDashboard: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<Tab>('api');

    return (
        <MainLayout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold dark:text-white">{t('monitoring.dashboard.title')}</h1>

                <EiCard>
                    <div className="flex space-x-2 border-b dark:border-gray-700 pb-2 mb-4">
                        <EiButton
                            variant={'ghost'}
                            onClick={() => setActiveTab('api')}
                        >
                            {t('monitoring.dashboard.tabs.api')}
                        </EiButton>
                        <EiButton
                            variant={'ghost'}
                            onClick={() => setActiveTab('page-views')}
                        >
                            {t('monitoring.dashboard.tabs.pageViews')}
                        </EiButton>
                        <EiButton
                            variant={'ghost'}
                            onClick={() => setActiveTab('system')}
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

export default MonitoringDashboard;

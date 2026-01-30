import React, { useEffect } from 'react';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/MainLayout/MainLayout';
import { EiCard } from '@/components/ui';
import { FollowersTable } from '@/features/dashboard/components/FollowersTable';
import { FeedsTable } from '@/features/dashboard/components/FeedsTable';
import { EmojisTable } from '@/features/dashboard/components/EmojisTable';
import { EventsTable } from '@/features/dashboard/components/EventsTable';
import { useAppDispatch } from '@/store/hooks';
import { fetchFollowers } from '../store/followersSlice';
import { fetchCompleteDashboardData } from '../store/dashboardSlice';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchFollowers());
        dispatch(fetchCompleteDashboardData('octocat'));
    }, [dispatch]);

    const stats = [
        {
            title: t('dashboard.stats.users'),
            value: '1,234',
            icon: Users,
            trend: '+12.5%',
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-950/30',
        },
        {
            title: t('dashboard.stats.revenue'),
            value: '$45,678',
            icon: DollarSign,
            trend: '+23.1%',
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100 dark:bg-emerald-950/30',
        },
        {
            title: t('dashboard.stats.sessions'),
            value: '567',
            icon: Activity,
            trend: '+5.4%',
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100 dark:bg-purple-950/30',
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-light">
                            {t('dashboard.title')}
                        </h1>
                        <p className="mt-1 text-theme-text-secondary">
                            {t('dashboard.subtitle')}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <EiCard
                                key={index}
                                hover
                                className="animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-theme-text-secondary">
                                            {stat.title}
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-theme-text-primary">
                                            {stat.value}
                                        </p>
                                        <div className="mt-2 flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                {stat.trend}
                                            </span>
                                            <span className="text-sm text-theme-text-tertiary">
                                                {t('dashboard.stats.vsLastMonth')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </EiCard>
                        );
                    })}
                </div>

                {/* Followers Table */}
                <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <FollowersTable />
                </div>

                {/* Feeds Table */}
                <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <FeedsTable />
                </div>

                {/* Emojis Table */}
                <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
                    <EmojisTable />
                </div>

                {/* Events Table */}
                <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
                    <EventsTable />
                </div>
            </div>
        </MainLayout>
    );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EiCard, EiButton } from '@/components/ui';
import { User, Shield, Trash2 } from 'lucide-react';

interface PendingUser {
    id: string;
    name: string;
    email: string;
    status: string;
    timestamp: string;
}

const UserManagement: React.FC = () => {
    const { t } = useTranslation();
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [approvedUsers, setApprovedUsers] = useState<any[]>([]);

    useEffect(() => {
        const storedPending = localStorage.getItem('pending_users');
        if (storedPending) {
            setPendingUsers(JSON.parse(storedPending));
        }

        const storedApproved = localStorage.getItem('approved_users');
        if (storedApproved) {
            setApprovedUsers(JSON.parse(storedApproved));
        }
    }, []);

    const handleApprove = (userId: string, role: 'admin' | 'user') => {
        const userToApprove = pendingUsers.find(u => u.id === userId);
        if (!userToApprove) return;

        // Remove from pending
        const updatedPending = pendingUsers.filter(u => u.id !== userId);
        setPendingUsers(updatedPending);
        localStorage.setItem('pending_users', JSON.stringify(updatedPending));

        // Add to approved/registered users
        const approvedUser = { ...userToApprove, role, status: 'active' };
        // Use functional state update to ensure we have latest state if called rapidly, but mostly just standard pattern
        const updatedApproved = [...approvedUsers, approvedUser];
        setApprovedUsers(updatedApproved); // Update local state for immediate UI update
        localStorage.setItem('approved_users', JSON.stringify(updatedApproved));

        alert(t('userManagement.alerts.userApproved', { role }));
    };

    const handleReject = (userId: string) => {
        const updated = pendingUsers.filter(u => u.id !== userId);
        setPendingUsers(updated);
        localStorage.setItem('pending_users', JSON.stringify(updated));
    };

    const handleRoleUpdate = (userId: string, newRole: 'admin' | 'user') => {
        const updatedUsers = approvedUsers.map(user => {
            if (user.id === userId) {
                return { ...user, role: newRole };
            }
            return user;
        });
        setApprovedUsers(updatedUsers);
        localStorage.setItem('approved_users', JSON.stringify(updatedUsers));
        alert(t('userManagement.alerts.roleUpdated', { role: newRole }));
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold dark:text-white mb-2">{t('userManagement.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('userManagement.subtitle')}</p>
            </div>

            {/* Pending Users Section */}
            <EiCard title={t('userManagement.pendingApprovals.title')}>
                {pendingUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {t('userManagement.pendingApprovals.noPending')}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-gray-700">
                                <tr>
                                    <th className="py-3 px-4 font-semibold">{t('userManagement.columns.name')}</th>
                                    <th className="py-3 px-4 font-semibold">{t('userManagement.columns.email')}</th>
                                    <th className="py-3 px-4 font-semibold">{t('userManagement.columns.registered')}</th>
                                    <th className="py-3 px-4 font-semibold text-right">{t('userManagement.columns.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingUsers.map(user => (
                                    <tr key={user.id} className="border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="py-4 px-4">{user.name}</td>
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500">
                                            {new Date(user.timestamp).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <EiButton
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                                    onClick={() => handleApprove(user.id, 'admin')}
                                                    title={t('userManagement.buttons.title.approveAdmin')}
                                                >
                                                    <Shield className="w-4 h-4 mr-1" /> {t('userManagement.buttons.admin')}
                                                </EiButton>
                                                <EiButton
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                                    onClick={() => handleApprove(user.id, 'user')}
                                                    title={t('userManagement.buttons.title.approveUser')}
                                                >
                                                    <User className="w-4 h-4 mr-1" /> {t('userManagement.buttons.user')}
                                                </EiButton>
                                                <EiButton
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => handleReject(user.id)}
                                                    title={t('userManagement.buttons.title.reject')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </EiButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </EiCard>

            {/* Approved Users Section */}
            <EiCard title={t('userManagement.registeredUsers.title')}>
                {approvedUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {t('userManagement.registeredUsers.noRegistered')}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-gray-700">
                                <tr>
                                    <th className="py-3 px-4 font-semibold">{t('userManagement.columns.name')}</th>
                                    <th className="py-3 px-4 font-semibold">{t('userManagement.columns.email')}</th>
                                    <th className="py-3 px-4 font-semibold">{t('userManagement.columns.currentRole')}</th>
                                    <th className="py-3 px-4 font-semibold text-right">{t('userManagement.columns.switchRole')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvedUsers.map(user => (
                                    <tr key={user.id} className="border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="py-4 px-4 font-medium">{user.name}</td>
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.role === 'admin' ? (
                                                    <EiButton
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleRoleUpdate(user.id, 'user')}
                                                        title={t('userManagement.buttons.title.demote')}
                                                    >
                                                        <User className="w-4 h-4 mr-1" /> {t('userManagement.buttons.makeUser')}
                                                    </EiButton>
                                                ) : (
                                                    <EiButton
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleRoleUpdate(user.id, 'admin')}
                                                        title={t('userManagement.buttons.title.promote')}
                                                    >
                                                        <Shield className="w-4 h-4 mr-1" /> {t('userManagement.buttons.makeAdmin')}
                                                    </EiButton>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </EiCard>
        </div>
    );
};

export default UserManagement;

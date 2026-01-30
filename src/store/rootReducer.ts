import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import followersReducer from '@/features/dashboard/store/followersSlice';
import dashboardReducer from '@/features/dashboard/store/dashboardSlice';
import themeReducer from '@/app/slices/themeSlice';

import monitoringReducer from '@/features/monitoring/store/monitoringSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    followers: followersReducer,
    dashboard: dashboardReducer,
    theme: themeReducer,
    monitoring: monitoringReducer,
});

export default rootReducer;

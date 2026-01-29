import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import followersReducer from '@/features/dashboard/store/followersSlice';
import themeReducer from '@/app/slices/themeSlice';

import monitoringReducer from '@/features/monitoring/store/monitoringSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    followers: followersReducer,
    theme: themeReducer,
    monitoring: monitoringReducer,
});

export default rootReducer;

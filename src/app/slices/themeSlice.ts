import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'emerald' | 'corporate' | 'midnight' | 'nord' | 'sunset';

interface ThemeState {
    mode: ThemeMode;
}

const initialState: ThemeState = {
    mode: (localStorage.getItem('theme-mode') as ThemeMode) || 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
            state.mode = action.payload;
            localStorage.setItem('theme-mode', action.payload);
        },
    },
});

export const { setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;

import type { ThemeMode } from '@/app/slices/themeSlice';

export interface ThemeColors {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
}

export const themeConfig: Record<ThemeMode, { name: string; description: string; icon: string; colors: ThemeColors }> = {
    light: {
        name: 'Light',
        description: 'Corporate & Professional',
        icon: 'sun',
        colors: {
            primary: '33 150 243', // #2196f3
            primaryHover: '23 105 170', // #1769aa
            secondary: '245 0 87', // #f50057
            accent: '99 102 241',
            bgPrimary: '249 250 251', // #f9fafb
            bgSecondary: '255 255 255', // #ffffff
            bgTertiary: '243 244 246',
            textPrimary: '17 24 39',
            textSecondary: '75 85 99',
            textTertiary: '156 163 175',
            border: '229 231 235',
        },
    },
    dark: {
        name: 'Dark',
        description: 'Modern & Sleek',
        icon: 'moon',
        colors: {
            primary: '144 202 249', // #90caf9
            primaryHover: '66 165 245', // #42a5f5
            secondary: '244 143 177', // #f48fb1
            accent: '129 140 248', // #818cf8
            bgPrimary: '18 18 18', // #121212
            bgSecondary: '30 30 30', // #1e1e1e
            bgTertiary: '48 48 48', // #303030
            textPrimary: '156 163 175', // #9ccbfbff
            textSecondary: '209 213 219', // #d1d5db
            textTertiary: '156 163 175', // #9ca3af
            border: '55 65 81', // #374151
        },
    },
    emerald: {
        name: 'Emerald',
        description: 'Fresh & Vibrant',
        icon: 'palette',
        colors: {
            primary: '16 185 129', // #10b981
            primaryHover: '5 150 105', // #059669
            secondary: '99 102 241', // #6366f1
            accent: '79 70 229',
            bgPrimary: '240 253 244', // #f0fdf4
            bgSecondary: '255 255 255', // #ffffff
            bgTertiary: '220 252 231',
            textPrimary: '6 78 59',
            textSecondary: '6 95 70',
            textTertiary: '52 211 153',
            border: '187 247 208',
        },
    },
    corporate: {
        name: 'Corporate',
        description: 'Professional Blue/Grey',
        icon: 'briefcase',
        colors: {
            primary: '13 71 161', // #0d47a1
            primaryHover: '0 33 113', // #002171
            secondary: '96 125 139', // #607d8b
            accent: '14 165 233',
            bgPrimary: '245 247 250', // #f5f7fa
            bgSecondary: '255 255 255', // #ffffff
            bgTertiary: '241 245 249',
            textPrimary: '15 23 42',
            textSecondary: '51 65 85',
            textTertiary: '148 163 184',
            border: '226 232 240',
        },
    },
    midnight: {
        name: 'Midnight',
        description: 'Deep Navy/Purple',
        icon: 'star',
        colors: {
            primary: '0 229 255', // #00e5ff
            primaryHover: '0 184 212',
            secondary: '213 0 249', // #d500f9
            accent: '168 85 247',
            bgPrimary: '10 25 41', // #0a1929
            bgSecondary: '19 47 76', // #132f4c
            bgTertiary: '30 58 95',
            textPrimary: '224 242 241', // #e0f2f1
            textSecondary: '178 223 219', // #b2dfdb
            textTertiary: '148 163 184',
            border: '51 65 85',
        },
    },
    nord: {
        name: 'Nord',
        description: 'Cool Blue/Grey Palette',
        icon: 'wind',
        colors: {
            primary: '136 192 208', // #88c0d0
            primaryHover: '94 129 172',
            secondary: '208 135 112', // #d08770
            accent: '136 192 208',
            bgPrimary: '46 52 64', // #2e3440
            bgSecondary: '59 66 82', // #3b4252
            bgTertiary: '67 76 94',
            textPrimary: '236 239 244', // #eceff4
            textSecondary: '216 222 233', // #d8dee9
            textTertiary: '216 222 233',
            border: '76 86 106',
        },
    },
    sunset: {
        name: 'Sunset',
        description: 'Vibrant Orange/Warm',
        icon: 'sun',
        colors: {
            primary: '230 81 0', // #e65100
            primaryHover: '172 25 0', // #ac1900
            secondary: '49 27 146', // #311b92
            accent: '244 63 94',
            bgPrimary: '255 243 224', // #fff3e0
            bgSecondary: '255 255 255', // #ffffff
            bgTertiary: '254 243 199',
            textPrimary: '124 45 18',
            textSecondary: '154 52 18',
            textTertiary: '253 186 116',
            border: '254 215 170',
        },
    },
};

/**
 * Apply theme to document root
 */
export const applyTheme = (mode: ThemeMode): void => {
    const root = document.documentElement;
    const theme = themeConfig[mode];

    // Remove all theme classes first
    const allThemes = Object.keys(themeConfig) as ThemeMode[];
    allThemes.forEach(t => {
        if (t !== 'light') { // 'light' is default, no class usually or handle differently
            root.classList.remove(t === 'dark' ? 'dark' : `theme-${t}`);
        }
    });
    // Remove specifically just in case
    root.classList.remove('dark');

    // Apply theme-specific classes
    if (mode === 'dark' || mode === 'nord' || mode === 'midnight') {
        root.classList.add('dark');
        if (mode !== 'dark') {
            root.classList.add(`theme-${mode}`);
        }
    } else if (mode !== 'light') {
        root.classList.add(`theme-${mode}`);
    }

    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
        const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
    });

    // Store theme preference
    localStorage.setItem('theme-mode', mode);
};

/**
 * Get initial theme from localStorage or system preference
 */
export const getInitialTheme = (): ThemeMode => {
    const stored = localStorage.getItem('theme-mode') as ThemeMode | null;

    if (stored && Object.keys(themeConfig).includes(stored)) {
        return stored;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
};

/**
 * Get theme-aware class names
 */
export const getThemeClasses = (mode: ThemeMode) => {
    const baseClasses = 'transition-colors duration-200';

    if (mode === 'light') return baseClasses;
    if (mode === 'dark') return `${baseClasses} dark`;
    return `${baseClasses} theme-${mode}`;
};

/**
 * Get current theme colors
 */
export const getThemeColors = (mode: ThemeMode): ThemeColors => {
    return themeConfig[mode].colors;
};

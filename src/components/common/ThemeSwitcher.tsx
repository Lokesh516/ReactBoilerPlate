import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Sun, Moon, Palette, Briefcase, Star, Wind, Sunset, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setThemeMode, type ThemeMode } from '../../app/slices/themeSlice';

interface ThemeSwitcherProps {
    dropUp?: boolean;
    align?: 'left' | 'right';
}

const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun; description: string }[] = [
    { mode: 'light', label: 'Light', icon: Sun, description: 'Corporate & Professional' },
    { mode: 'dark', label: 'Dark', icon: Moon, description: 'Modern & Sleek' },
    { mode: 'emerald', label: 'Emerald', icon: Palette, description: 'Fresh & Vibrant' },
    { mode: 'corporate', label: 'Corporate', icon: Briefcase, description: 'Professional Blue' },
    { mode: 'midnight', label: 'Midnight', icon: Star, description: 'Deep Navy' },
    { mode: 'nord', label: 'Nord', icon: Wind, description: 'Cool Blue/Grey' },
    { mode: 'sunset', label: 'Sunset', icon: Sunset, description: 'Vibrant Orange' },
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ dropUp = false, align = 'right' }) => {
    const dispatch = useAppDispatch();
    const { mode } = useAppSelector((state) => state.theme);

    const handleThemeChange = (newMode: ThemeMode) => {
        dispatch(setThemeMode(newMode));
    };

    const currentTheme = themeOptions.find((t) => t.mode === mode);
    const CurrentIcon = currentTheme?.icon || Sun;

    const placementClasses = `
        absolute 
        ${dropUp ? 'bottom-full mb-2' : 'mt-2'}
        ${align === 'left' ? 'left-0' : 'right-0'}
        ${dropUp
            ? (align === 'left' ? 'origin-bottom-left' : 'origin-bottom-right')
            : (align === 'left' ? 'origin-top-left' : 'origin-top-right')
        }
    `;

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                <CurrentIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Menu.Items className={`${placementClasses} w-64 rounded-xl glass-strong shadow-strong border border-white/20 dark:border-gray-700/50 focus:outline-none overflow-hidden z-50`}>
                    <div className="p-2">
                        {themeOptions.map((theme) => {
                            const Icon = theme.icon;
                            const isActive = mode === theme.mode;

                            return (
                                <Menu.Item key={theme.mode}>
                                    {({ active }) => (
                                        <button
                                            onClick={() => handleThemeChange(theme.mode)}
                                            className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                        ${active ? 'bg-primary-50 dark:bg-primary-950/30' : ''}
                        ${isActive ? 'bg-primary-100 dark:bg-primary-900/40' : ''}
                      `}
                                        >
                                            <div className={`
                        p-2 rounded-lg
                        ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}
                      `}>
                                                <Icon className="w-4 h-4" />
                                            </div>

                                            <div className="flex-1 text-left">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {theme.label}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {theme.description}
                                                </div>
                                            </div>

                                            {isActive && (
                                                <Check className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                            )}
                                        </button>
                                    )}
                                </Menu.Item>
                            );
                        })}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

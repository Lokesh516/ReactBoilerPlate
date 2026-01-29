import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, isRTLLanguage } from '@/config/language';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (code: string) => {
        i18n.changeLanguage(code);
        // Set document direction
        document.documentElement.dir = isRTLLanguage(code) ? 'rtl' : 'ltr';
        document.documentElement.lang = code;
        localStorage.setItem('i18nextLng', code);
    };

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
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
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl glass-strong shadow-strong border border-white/20 dark:border-gray-700/50 focus:outline-none overflow-hidden z-50">
                    <div className="p-2">
                        {Object.values(SUPPORTED_LANGUAGES).map((lang) => {
                            const isActive = i18n.language === lang.code;

                            return (
                                <Menu.Item key={lang.code}>
                                    {({ active }) => (
                                        <button
                                            onClick={() => handleLanguageChange(lang.code)}
                                            className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200
                        ${active ? 'bg-primary-50 dark:bg-primary-950/30' : ''}
                        ${isActive ? 'bg-primary-100 dark:bg-primary-900/40' : ''}
                      `}
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className="font-medium text-light text-sm">
                                                    {lang.nativeName}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {lang.name}
                                                </span>
                                            </div>

                                            {isActive && (
                                                <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
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

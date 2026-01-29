/**
 * i18n Language Configuration
 * Defines supported languages and their metadata
 */

export interface LanguageConfig {
    code: string;
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
    en: {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        direction: 'ltr',
    },
    fr: {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        direction: 'ltr',
    },
    es: {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        direction: 'ltr',
    },
    ar: {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        direction: 'rtl',
    },
    zh: {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        direction: 'ltr',
    },
};

export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGE_CODES = Object.keys(SUPPORTED_LANGUAGES);

/**
 * Get language direction for a given language code
 * @param languageCode - Language code (e.g., 'en', 'ar')
 * @returns Direction: 'ltr' or 'rtl'
 */
export const getLanguageDirection = (languageCode: string): 'ltr' | 'rtl' => {
    const config = SUPPORTED_LANGUAGES[languageCode];
    return config?.direction || 'ltr';
};

/**
 * Check if language is RTL
 * @param languageCode - Language code
 * @returns True if language is RTL
 */
export const isRTLLanguage = (languageCode: string): boolean => {
    return getLanguageDirection(languageCode) === 'rtl';
};

/**
 * Get native name for a language
 * @param languageCode - Language code
 * @returns Native name of the language
 */
export const getLanguageName = (languageCode: string): string => {
    return SUPPORTED_LANGUAGES[languageCode]?.nativeName || languageCode;
};

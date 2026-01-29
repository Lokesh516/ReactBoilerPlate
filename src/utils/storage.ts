const STORAGE_PREFIX = 'ei_boilerplate_';

export const storage = {
    getToken: () => localStorage.getItem(`${STORAGE_PREFIX}token`),
    setToken: (token: string) => localStorage.setItem(`${STORAGE_PREFIX}token`, token),
    clearToken: () => localStorage.removeItem(`${STORAGE_PREFIX}token`),

    get: (key: string) => {
        const value = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
        try {
            return value ? JSON.parse(value) : null;
        } catch {
            return value;
        }
    },
    set: (key: string, value: any) => {
        localStorage.setItem(
            `${STORAGE_PREFIX}${key}`,
            typeof value === 'string' ? value : JSON.stringify(value)
        );
    },
    remove: (key: string) => localStorage.removeItem(`${STORAGE_PREFIX}${key}`),
    clearAll: () => {
        Object.keys(localStorage)
            .filter((key) => key.startsWith(STORAGE_PREFIX))
            .forEach((key) => localStorage.removeItem(key));
    },
};

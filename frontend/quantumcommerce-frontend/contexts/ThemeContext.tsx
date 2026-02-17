'use client';

import {
    createContext,
    useContext,
    useCallback,
    useSyncExternalStore,
    ReactNode,
} from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

let listeners: Array<() => void> = [];

function emitChange() {
    listeners.forEach((fn) => fn());
}

function subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
        listeners = listeners.filter((fn) => fn !== listener);
    };
}

function getSnapshot(): Theme {
    try {
        const stored = localStorage.getItem('qc-theme') as Theme | null;
        if (stored) return stored;
    } catch {
        // localStorage unavailable (e.g. restricted browsing context)
    }
    if (typeof document !== 'undefined') {
        const attr = document.documentElement.getAttribute(
            'data-theme',
        ) as Theme | null;
        if (attr) return attr;
    }
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }
    return 'dark';
}

function getServerSnapshot(): Theme {
    return 'dark';
}

function applyTheme(theme: Theme) {
    try {
        localStorage.setItem('qc-theme', theme);
    } catch {
        // localStorage unavailable
    }
    document.documentElement.setAttribute('data-theme', theme);
    emitChange();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const theme = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
    );

    const toggleTheme = useCallback(() => {
        applyTheme(theme === 'dark' ? 'light' : 'dark');
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

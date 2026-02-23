'use client';

import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
    useLayoutEffect
} from 'react';
import { useLocalStorage } from 'usehooks-ts'

type ThemeContextType = {
  theme: string
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType| null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [value, setValue] = useLocalStorage('qc-theme', 'dark');

    const toggleTheme = () => {
        setValue((theme: string) => (theme === 'dark' ? 'light' : 'dark'));
    };

    useLayoutEffect(() => {
        document.documentElement.setAttribute('data-theme', value);
    }, [value, setValue]);

    return (
        <ThemeContext.Provider value={{ theme: value, toggleTheme }}>
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

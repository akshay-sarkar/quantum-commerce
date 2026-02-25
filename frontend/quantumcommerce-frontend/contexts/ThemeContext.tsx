'use client';

import {
    createContext,
    useContext,
    ReactNode,
    Dispatch,
    SetStateAction,    
    useLayoutEffect
} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

type ThemeContextType = {
  theme: string
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType| null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [value, setValue] = useLocalStorage<string>('qc-theme', 'dark') as [string, Dispatch<SetStateAction<string>>];

    const toggleTheme = () => {
        setValue((prev: string) => (prev === 'dark' ? 'light' : 'dark'));
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

'use client';

import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect
} from 'react';
import { useLocalStorage } from 'usehooks-ts'

type ThemeContextType = {
  theme: string
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType| null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [value, setValue] = useLocalStorage('qc-theme', 'dark');
    const [theme, setTheme] = useState(value);

    const toggleTheme = () => {
        setTheme((theme: string) => (theme === 'dark' ? 'light' : 'dark'));
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        setValue(theme);
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

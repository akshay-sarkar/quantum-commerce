'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="bg-qc-bg border-b border-qc-border transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
                <Link
                    href="/"
                    className="font-display text-xl tracking-tight text-qc-text"
                >
                    Quantum Commerce
                </Link>

                <div className="flex items-center gap-8">
                    <Link
                        href="/products"
                        className="text-sm tracking-wide text-qc-muted hover:text-qc-text transition-colors duration-300"
                        aria-label="Products"
                    >
                        Products
                    </Link>

                    <Link
                        href="/about"
                        className="text-sm tracking-wide text-qc-muted hover:text-qc-text transition-colors duration-300"
                        aria-label="About"
                    >
                        About
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="text-qc-muted hover:text-qc-text transition-colors duration-300"
                        aria-label="Toggle theme"
                        suppressHydrationWarning
                    >
                        {theme === 'dark' ? (
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>


                    <Link
                        href="/cart"
                        className="text-sm tracking-wide text-qc-muted hover:text-qc-text transition-colors duration-300"
                        aria-label="Cart"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <span className="hidden sm:inline text-sm text-qc-muted">
                                Welcome,{' '}
                                <span className="text-qc-accent">
                                    {user?.firstName}
                                </span>
                            </span>
                            <button
                                onClick={logout}
                                className="text-sm tracking-wide text-qc-muted hover:text-qc-text transition-colors duration-300"
                                aria-label="Logout"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="px-5 py-2 border border-qc-accent text-qc-accent text-sm tracking-wide uppercase hover:bg-qc-accent hover:text-qc-accent-on transition-all duration-300"
                            aria-label="Login"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

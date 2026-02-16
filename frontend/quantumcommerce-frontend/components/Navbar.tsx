'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav className="bg-[#060606] border-b border-[#1a1a1a]">
            <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
                <Link
                    href="/"
                    className="font-display text-xl tracking-tight text-[#F0EDE6]"
                >
                    Quantum Commerce
                </Link>

                <div className="flex items-center gap-8">
                    <Link
                        href="/products"
                        className="text-sm tracking-wide text-[#8A8578] hover:text-[#F0EDE6] transition-colors duration-300"
                    >
                        Products
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <span className="hidden sm:inline text-sm text-[#8A8578]">
                                Welcome,{' '}
                                <span className="text-[#C9A96E]">
                                    {user?.firstName}
                                </span>
                            </span>
                            <button
                                onClick={logout}
                                className="text-sm tracking-wide text-[#8A8578] hover:text-[#F0EDE6] transition-colors duration-300"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="px-5 py-2 border border-[#C9A96E] text-[#C9A96E] text-sm tracking-wide uppercase hover:bg-[#C9A96E] hover:text-[#060606] transition-all duration-300"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const inputClasses =
    'w-full bg-transparent border border-qc-border text-qc-text placeholder-qc-placeholder px-4 py-3 text-sm tracking-wide focus:border-qc-accent focus:outline-none transition-colors duration-300';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password, firstName, lastName);
            }

            // Redirect to products page after successful login/signup
            router.push('/products');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-qc-bg flex items-center justify-center px-6 py-12 relative transition-colors duration-300">
            {/* Ambient glow */}
            <div className="qc-orb-1 opacity-50" />

            <div className="relative z-10 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link
                        href="/"
                        className="font-display text-sm tracking-[0.2em] uppercase text-qc-accent hover:text-qc-accent-hover transition-colors duration-300"
                    >
                        Quantum Commerce
                    </Link>
                    <h2
                        className="font-display mt-6 tracking-[-0.02em] text-qc-text"
                        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </h2>
                    <p className="mt-3 text-sm text-qc-muted">
                        {isLogin
                            ? 'Welcome back to Quantum Commerce'
                            : 'Join the future of commerce'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="block text-xs tracking-wide text-qc-muted uppercase mb-2"
                                >
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required={!isLogin}
                                    className={inputClasses}
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="lastName"
                                    className="block text-xs tracking-wide text-qc-muted uppercase mb-2"
                                >
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required={!isLogin}
                                    className={inputClasses}
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-xs tracking-wide text-qc-muted uppercase mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className={inputClasses}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-xs tracking-wide text-qc-muted uppercase mb-2"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            required
                            className={inputClasses}
                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-400 text-center py-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-2 bg-qc-accent text-qc-accent-on font-medium tracking-wide text-sm uppercase hover:bg-qc-accent-hover transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? 'Please wait...'
                            : isLogin
                              ? 'Sign In'
                              : 'Create Account'}
                    </button>

                    <div className="text-center pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-sm text-qc-accent hover:text-qc-accent-hover transition-colors duration-300"
                        >
                            {isLogin
                                ? "Don't have an account? Sign up"
                                : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

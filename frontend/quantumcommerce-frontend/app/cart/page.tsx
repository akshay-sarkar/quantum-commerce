'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-qc-bg px-6 py-12 transition-colors duration-300">
                <div className="max-w-6xl mx-auto">
                    <h1
                        className="font-display text-qc-text tracking-[-0.02em] mb-8"
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                        }}
                    >
                        Shopping Cart
                    </h1>
                    <p className="text-qc-muted">
                        Welcome to your cart, {user?.firstName}!
                    </p>
                    {/* Cart functionality will go here */}
                </div>
            </div>
        </ProtectedRoute>
    );
}

'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import CartList from './_components/CartList';
import SaveForLaterList from './_components/SaveForLaterList';

export default function CartPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-qc-bg px-6 py-12 transition-colors duration-300">
                <div className="max-w-6xl mx-auto">
                    <h1
                        className="font-display text-qc-text tracking-[-0.02em] mb-4"
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                        }}
                    >
                        Shopping Cart
                    </h1>
                    <p className="text-qc-muted mb-6">
                        Welcome to your cart, {user?.firstName}!
                    </p>
                <CartList />
                <SaveForLaterList/>
                </div>
            </div>
        </ProtectedRoute>
    );
}

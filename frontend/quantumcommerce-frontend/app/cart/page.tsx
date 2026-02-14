'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
                <p className="text-gray-600">Welcome to your cart, {user?.firstName}!</p>
                {/* Cart functionality will go here */}
            </div>
        </ProtectedRoute>
    );
}
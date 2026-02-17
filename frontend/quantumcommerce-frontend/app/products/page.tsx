'use client';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      description
      category
      inventory
      imageUrl
    }
  }
`;

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    inventory: number;
    imageUrl: string;
}

export default function ProductsPage() {
    const { loading, error, data } = useQuery<{ products: Product[] }>(GET_PRODUCTS);

    if (loading)
        return (
            <div className="min-h-screen bg-qc-bg flex items-center justify-center text-qc-muted transition-colors duration-300">
                Loading products...
            </div>
        );
    if (error)
        return (
            <div className="min-h-screen bg-qc-bg flex items-center justify-center text-red-400 transition-colors duration-300">
                Error: {error.message}
            </div>
        );

    return (
        <div className="min-h-screen bg-qc-bg px-6 py-12 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <h1
                    className="font-display text-qc-text tracking-[-0.02em] mb-10"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
                >
                    Our Products
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data &&
                        data.products.map((product: Product) => (
                            <div
                                key={product.id}
                                className="qc-card border border-qc-border overflow-hidden"
                            >
                                {product.imageUrl && (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <h2 className="text-lg font-medium text-qc-text mb-2">
                                        {product.name}
                                    </h2>
                                    <p className="text-sm text-qc-muted mb-4">
                                        {product.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-qc-accent">
                                            ${product.price}
                                        </span>
                                        <span className="text-xs text-qc-muted">
                                            {product.inventory} in stock
                                        </span>
                                    </div>
                                    <p className="text-xs text-qc-muted mt-2">
                                        Category: {product.category}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

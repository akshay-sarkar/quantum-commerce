'use client';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import Product from '@/components/Product';
import { IProduct } from '@/models';

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



export default function ProductsPage() {
    const { loading, error, data } = useQuery<{ products: IProduct[] }>(GET_PRODUCTS);

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
                        data.products.map((product: IProduct) => (
                            <Product key={product.id} {...product} />
                        ))}
                </div>
            </div>
        </div>
    );
}

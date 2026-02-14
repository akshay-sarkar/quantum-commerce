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

    if (loading) return <div className="p-8">Loading products...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Our Products</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data && data.products.map((product: Product) => (
                    <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                        {product.imageUrl && (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                            <p className="text-gray-600 mb-4">{product.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                                <span className="text-sm text-gray-500">{product.inventory} in stock</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Category: {product.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
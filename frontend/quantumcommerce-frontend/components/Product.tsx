'use client';


import { IProduct } from "@/models";
import useCartStore from '@/stores/cartStore';
import ProductImage from "@/components/ProductImage";

function Product(product: IProduct) {
    const addToCart = useCartStore(state => state.addToCart);
    const removeFromCart = useCartStore(state => state.removeFromCart);
    const existingItemQuantity = useCartStore(state => state.existingItemQuantity(product.id));

    return <div
        key={product.id}
        className="qc-card border border-qc-border overflow-hidden"
    >
        {product.imageUrl && (
            <ProductImage product={product}/>
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
                <span className="text-xl font-bold text-qc-accent">
                    {existingItemQuantity > 0 ? `In Cart: ${existingItemQuantity}` : ''}
                </span>
                <button 
                    onClick={() => existingItemQuantity > 0 ? removeFromCart(product.id) : addToCart(product)}
                    className="px-4 py-2 bg-qc-accent text-qc-accent-on text-sm font-medium rounded hover:bg-qc-accent-hover transition-colors duration-300">
                    {existingItemQuantity > 0 ? "Remove from Cart" : "Add to Cart"}
                </button>
            </div>
            <p className="text-xs text-qc-muted mt-2">
                Category: {product.category}
            </p>
        </div>
    </div>;
}

export default Product;
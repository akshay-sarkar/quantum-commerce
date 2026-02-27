import React from 'react';
import useCartStore from '@/stores/cartStore';
import ProductImage from '@/components/ProductImage';

function SaveForLaterList() {
    const savedItems = useCartStore(state => state.saveForLaterCart);
    const moveToCart = useCartStore(state => state.moveToCart);
    const removeFromSaveForLater = useCartStore(state => state.removeFromSaveForLater);
    const addToCart = useCartStore(state => state.addToCart);

    if (!savedItems || savedItems.length === 0) return null;

    return (
        <section className="mt-8">
            <h2 className="text-lg font-semibold text-qc-text mb-4">Saved for later ({savedItems.length} item{savedItems.length > 1 ? 's' : ''})</h2>

            <div className="overflow-x-auto">
                <div className="flex gap-4 pb-4">
                    {savedItems && savedItems.map((item) => (
                        <div
                            key={item.id}
                            className="min-w-[260px] max-w-sm qc-card border border-qc-border bg-qc-surface rounded-md overflow-hidden"
                        >
                            <div className="p-3">
                                <div className="w-full h-40 mb-3">
                                    <ProductImage product={item} imageClass="w-full h-full object-cover rounded" height={160} width={260} />
                                </div>

                                <h3 className="text-sm font-semibold text-qc-text mb-1">{item.name}</h3>
                                <p className="text-xs text-qc-muted mb-3 line-clamp-2">{item.description}</p>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-qc-muted">Price</div>
                                        <div className="text-lg font-bold text-qc-accent">${item.price.toFixed(2)}</div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            onClick={() => {
                                                // add to cart (qty 1) and remove from saved list
                                                addToCart(item, 1);
                                                removeFromSaveForLater(item.id);
                                            }}
                                            className="px-4 py-2 bg-qc-accent text-qc-accent-on rounded text-sm font-medium hover:bg-qc-accent-hover transition-colors duration-200"
                                        >
                                            Move to cart
                                        </button>

                                        <button
                                            onClick={() => removeFromSaveForLater(item.id)}
                                            className="text-xs text-qc-muted underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default SaveForLaterList;
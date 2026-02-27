'use client';

import ProductImage from '@/components/ProductImage';   
import useCartStore from '@/stores/cartStore';  

function CartList() {

    const cartItems = useCartStore(state => state.cart);
    const removeFromCart = useCartStore(state => state.removeFromCart);
    const updateQuantity = useCartStore(state => state.updateQuantity);
    const addToSaveForLater = useCartStore(state => state.addToSaveForLater);
    
    const totalDistinct = cartItems.length;
    const totalQuantity = cartItems.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = cartItems.reduce(
        (s, i) => s + i.price * i.quantity,
        0
    );

    return (
                            <div className="bg-qc-surface shadow-sm rounded-md overflow-hidden">
                        <ul>
                            {cartItems.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex gap-4 p-4 border-b border-qc-border last:border-b-0 items-center"
                                >
                                    <ProductImage
                                        product={item}
                                        imageClass="w-24 h-24 object-cover rounded"
                                    />

                                    {/* Left: name/desc/unit price */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-qc-text">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-qc-muted">
                                            {item.description}
                                        </p>
                                        <div className="text-sm text-qc-muted mt-2">
                                            Unit: <span className="font-medium text-qc-text">${item.price.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Middle: quantity + actions */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <label className="sr-only">Quantity</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    let v = parseInt(e.target.value || '1', 10);
                                                    if (Number.isNaN(v) || v < 1) v = 1;
                                                    updateQuantity(item.id, v);
                                                }}
                                                className="w-20 bg-transparent border border-qc-border text-qc-text rounded px-2 py-1"
                                            />

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="px-3 py-1 text-sm border border-qc-accent text-qc-accent rounded hover:bg-qc-accent hover:text-qc-accent-on transition-colors duration-200"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => {
                                                // Simple save-for-later: remove from cart for now
                                                addToSaveForLater(item);
                                            }}
                                            className="text-sm text-qc-muted underline"
                                        >
                                            Save for later
                                        </button>
                                    </div>

                                    {/* Right: item total */}
                                    <div className="text-sm font-semibold text-qc-text">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="text-sm text-qc-muted">
                                Items: <span className="font-medium text-qc-text">{totalDistinct}</span>
                            </div>
                            <div className="text-sm text-qc-muted">
                                Quantity: <span className="font-medium text-qc-text">{totalQuantity}</span>
                            </div>
                            <div className="text-lg font-semibold text-qc-text">
                                Total: ${totalPrice.toFixed(2)}
                            </div>
                        </div>
                    </div>
    );
}

export default CartList;
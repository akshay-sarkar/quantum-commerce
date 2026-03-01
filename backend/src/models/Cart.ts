import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
    productId: string,
    quantity: number,
}

export interface ICart extends Document {
    userId: mongoose.Types.ObjectId,
    items: ICartItem[],
    updatedAt: Date
}

const CartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        productId: {
            type: String,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<ICart>('Cart', CartSchema);

import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from './Product';

export interface ICartItem {
    product: mongoose.Types.ObjectId | IProduct,
    quantity: number
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
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1
        }
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<ICart>('Cart', CartSchema);

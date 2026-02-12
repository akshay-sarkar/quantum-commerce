import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {
    productId: mongoose.Types.ObjectId,
    quantity: number,
}

export interface ICartSchema extends Document {
    userId: mongoose.Types.ObjectId,
    items: ICart[],
    updatedAt: Date
}

const CartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<ICart>('Cart', CartSchema);
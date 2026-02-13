import mongoose, { Schema, Document } from 'mongoose';

// Define your allowed list of values
const allowedCategories = ['Electronics', 'Clothing', 'Books', 'Furniture'];

export interface IProduct extends Document {
    name: string,
    description: string,
    price: number,
    inventory: number,
    category: string,
    imageUrl: string,
    createdAt: Date,
    addedBy: mongoose.Types.ObjectId,
}

const ProductSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    inventory: { type: Number, required: true },
    category: { type: String, required: true, trim: true, enum: allowedCategories },
    imageUrl: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    addedBy: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
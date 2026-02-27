import mongoose, { Schema, Document } from 'mongoose';

// Define your allowed list of values
const allowedCategories = ['Electronics', 'Clothing', 'Books', 'Furniture'];

export interface IProduct extends Document {
    id: string,
    name: string,
    description: string,
    price: number,
    inventory: number,
    category: string,
    imageUrl: string,
    createdAt: Date,
    addedBy: mongoose.Types.ObjectId,
    isActive?: boolean
}

const ProductSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    inventory: { type: Number, required: true },
    category: { type: String, required: true, trim: true, enum: allowedCategories },
    imageUrl: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    addedBy: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    isActive: { type: Boolean, default: true }
});

export default mongoose.model<IProduct>('Product', ProductSchema);
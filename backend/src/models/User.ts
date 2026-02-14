import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    userType: string,
    address: mongoose.Types.ObjectId,
}

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minLength: 6, maxLength: 70 },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    userType: { type: String, required: true, enum: ['BUYER', 'ADMIN'] },
    address: { type: mongoose.Types.ObjectId, ref: 'Address' }
});

export default mongoose.model<IUser>('User', UserSchema);
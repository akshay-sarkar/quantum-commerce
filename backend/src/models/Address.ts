import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
}

const AddressSchema = new Schema({
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zip: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true }
});

export default mongoose.model<IAddress>('Address', AddressSchema);
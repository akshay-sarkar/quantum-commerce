import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const AddressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zip: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
});

export default mongoose.model<IAddress>('Address', AddressSchema);

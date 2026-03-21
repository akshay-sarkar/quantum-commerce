import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  nameOnCard: string;
  last4: string;
  expiry: string;
}

const PaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  nameOnCard: { type: String, required: true, trim: true },
  last4: { type: String, required: true, length: 4 },
  expiry: { type: String, required: true },
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);

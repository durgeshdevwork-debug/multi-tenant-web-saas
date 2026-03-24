import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  tenantId: mongoose.Types.ObjectId | string;
  title: string;
  description: string;
  imageUrl?: string;
  priceLabel?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    priceLabel: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', serviceSchema);

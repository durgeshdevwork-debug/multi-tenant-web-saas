import mongoose, { Schema, Document } from 'mongoose';

export interface IContactContent extends Document {
  tenantId: mongoose.Types.ObjectId | string;
  address?: string;
  phone?: string;
  email?: string;
  introText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactContentSchema = new Schema<IContactContent>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    introText: { type: String }
  },
  { timestamps: true }
);

export const ContactContent = mongoose.model<IContactContent>('ContactContent', contactContentSchema);

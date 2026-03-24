import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  slug: string;
  primaryDomain?: string;
  templateId: mongoose.Types.ObjectId | string;
  apiKeyHash: string;
  truncatedApiKey: string;
  status: 'active' | 'inactive' | 'pending';
  businessDetails?: {
    name?: string;
    address?: string;
    phone?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    primaryDomain: { type: String, required: false },
    templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
    apiKeyHash: { type: String, required: true },
    truncatedApiKey: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'pending'], 
      default: 'pending' 
    },
    businessDetails: {
      name: { type: String },
      address: { type: String },
      phone: { type: String }
    }
  },
  { timestamps: true }
);

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema);

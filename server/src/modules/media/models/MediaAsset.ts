import mongoose, { Document, Schema } from 'mongoose';

export interface IMediaAsset extends Document {
  tenantId: mongoose.Types.ObjectId | string;
  url: string;
  key: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy?: string;
  altText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mediaAssetSchema = new Schema<IMediaAsset>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    url: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: String },
    altText: { type: String }
  },
  { timestamps: true }
);

export const MediaAsset = mongoose.model<IMediaAsset>('MediaAsset', mediaAssetSchema);


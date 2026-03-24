import mongoose, { Schema, Document } from 'mongoose';

export interface ILandingContent extends Document {
  tenantId: mongoose.Types.ObjectId | string;
  heroTitle: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  highlights: {
    title: string;
    description: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const landingContentSchema = new Schema<ILandingContent>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    heroTitle: { type: String, required: true },
    heroSubtitle: { type: String },
    heroImageUrl: { type: String },
    primaryCtaText: { type: String },
    primaryCtaUrl: { type: String },
    highlights: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

export const LandingContent = mongoose.model<ILandingContent>('LandingContent', landingContentSchema);

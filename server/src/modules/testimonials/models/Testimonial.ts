import mongoose, { Document, Schema } from 'mongoose';

export type TestimonialFormat = 'text' | 'video' | 'audio';

export interface ITestimonial extends Document {
  tenantId: mongoose.Types.ObjectId;
  collectionId: string;
  format: TestimonialFormat;
  title?: string;
  body?: string;
  authorName: string;
  authorRole?: string;
  company?: string;
  avatarUrl?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  rating?: number;
  isPublished: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    tenantId: { type: Schema.Types.ObjectId, required: true, index: true },
    collectionId: { type: String, required: true, index: true, trim: true },
    format: { type: String, enum: ['text', 'video', 'audio'], default: 'text' },
    title: { type: String, trim: true },
    body: { type: String, default: '' },
    authorName: { type: String, required: true, trim: true },
    authorRole: { type: String, trim: true },
    company: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    mediaUrl: { type: String, trim: true },
    thumbnailUrl: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5 },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

testimonialSchema.index({ tenantId: 1, collectionId: 1, sortOrder: 1, createdAt: -1 });

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);

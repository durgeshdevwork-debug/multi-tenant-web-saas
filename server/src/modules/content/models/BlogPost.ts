import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  tenantId: mongoose.Types.ObjectId | string;
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  coverImageUrl?: string;
  publishedAt?: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    excerpt: { type: String },
    body: { type: String, required: true },
    coverImageUrl: { type: String },
    publishedAt: { type: Date },
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Ensure slugs are unique per tenant
blogPostSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

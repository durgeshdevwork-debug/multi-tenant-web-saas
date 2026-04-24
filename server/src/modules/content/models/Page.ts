import mongoose, { Document, Schema } from 'mongoose';

export type PageSectionType = 'hero' | 'richText' | 'features' | 'cta' | 'gallery' | 'collection';

export interface IPageSection extends Record<string, any> {
  id: string;
  type: PageSectionType;
  name?: string;
  content: Record<string, any>;
  styles?: Record<string, any>;
}

export interface IPage extends Document {
  tenantId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId | null;
  title: string;
  slug: string;
  navigationLabel?: string;
  showInHeader: boolean;
  showInFooter: boolean;
  showHeader: boolean;
  showFooter: boolean;
  isHomePage: boolean;
  isPublished: boolean;
  sortOrder: number;
  sections: IPageSection[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const pageSectionSchema = new Schema<IPageSection>(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['hero', 'richText', 'features', 'cta', 'gallery', 'collection'],
      required: true
    },
    name: String,
    content: { type: Schema.Types.Mixed, default: {} },
    styles: { type: Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const pageSchema = new Schema<IPage>(
  {
    tenantId: { type: Schema.Types.ObjectId, required: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Page', default: null, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    navigationLabel: { type: String, trim: true },
    showInHeader: { type: Boolean, default: true },
    showInFooter: { type: Boolean, default: true },
    showHeader: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true },
    isHomePage: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    sections: { type: [pageSectionSchema], default: [] },
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String
    }
  },
  { timestamps: true }
);

pageSchema.index({ tenantId: 1, parentId: 1, slug: 1 }, { unique: true });

export const Page = mongoose.model<IPage>('Page', pageSchema);

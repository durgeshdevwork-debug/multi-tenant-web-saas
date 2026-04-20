import mongoose, { Document, Schema } from 'mongoose';

export type NavigationPageKey = 'landing' | 'about' | 'services' | 'blog' | 'contact';

export interface INavigationItem {
  label: string;
  pageKey?: NavigationPageKey;
  url?: string;
  newTab?: boolean;
  children?: INavigationItem[];
}

export interface IFooterSection {
  title: string;
  links: INavigationItem[];
}

export interface INavigation extends Document {
  tenantId: mongoose.Types.ObjectId;
  header: INavigationItem[];
  footer: IFooterSection[];
  copyright?: string;
  createdAt: Date;
  updatedAt: Date;
}

const navItemSchema = new Schema<INavigationItem>(
  {
    label: { type: String, required: true, trim: true },
    pageKey: {
      type: String,
      enum: ['landing', 'about', 'services', 'blog', 'contact']
    },
    url: String,
    newTab: { type: Boolean, default: false },
    children: []
  },
  { _id: false }
);

navItemSchema.add({
  children: [navItemSchema]
});

const footerSectionSchema = new Schema<IFooterSection>(
  {
    title: { type: String, required: true, trim: true },
    links: { type: [navItemSchema], default: [] }
  },
  { _id: false }
);

const navigationSchema = new Schema<INavigation>(
  {
    tenantId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
    header: { type: [navItemSchema], default: [] },
    footer: { type: [footerSectionSchema], default: [] },
    copyright: String
  },
  { timestamps: true }
);

export const Navigation = mongoose.model<INavigation>('Navigation', navigationSchema);

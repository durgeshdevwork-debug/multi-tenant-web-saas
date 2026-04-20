import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  tenantId: mongoose.Types.ObjectId;
  siteName: string;
  domain?: string;
  logo?: {
    url: string;
    alt?: string;
  };
  favicon?: string;
  business: {
    email?: string;
    phone?: string;
    address?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  seo: {
    defaultTitle?: string;
    defaultDescription?: string;
    ogImage?: string;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    tenantId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
    siteName: { type: String, default: '' },
    domain: String,
    logo: {
      url: String,
      alt: String
    },
    favicon: String,
    business: {
      email: String,
      phone: String,
      address: String
    },
    social: {
      facebook: String,
      instagram: String,
      linkedin: String,
      twitter: String
    },
    seo: {
      defaultTitle: String,
      defaultDescription: String,
      ogImage: String
    },
    theme: {
      primaryColor: String,
      secondaryColor: String,
      fontFamily: String
    }
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);

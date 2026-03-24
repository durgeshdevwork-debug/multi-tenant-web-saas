import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutContent extends Document {
  tenantId: mongoose.Types.ObjectId | string;
  heading: string;
  description: string;
  showTeam: boolean;
  teamMembers: {
    name: string;
    role: string;
    imageUrl?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const aboutContentSchema = new Schema<IAboutContent>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    heading: { type: String, required: true },
    description: { type: String, required: true },
    showTeam: { type: Boolean, default: false },
    teamMembers: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        imageUrl: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export const AboutContent = mongoose.model<IAboutContent>('AboutContent', aboutContentSchema);

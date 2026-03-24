import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  identifier: string;
  modules: string[];
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
    modules: [{ type: String }] // e.g. ['landing', 'about', 'services', 'blog', 'contact']
  },
  { timestamps: true }
);

export const Template = mongoose.model<ITemplate>('Template', templateSchema);

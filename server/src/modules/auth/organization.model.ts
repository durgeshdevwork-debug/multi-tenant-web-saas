import mongoose, { Schema, Document } from "mongoose";

export interface IOrganization extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    logo?: string;
    metadata?: string;
    createdAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logo: { type: String },
    metadata: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export const Organization =
    mongoose.models.Organization ||
    mongoose.model<IOrganization>("Organization", OrganizationSchema);

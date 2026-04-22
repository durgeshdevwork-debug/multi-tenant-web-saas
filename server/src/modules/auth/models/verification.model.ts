import mongoose, { Schema, Document } from "mongoose";

export interface IVerification extends Document {
    _id: mongoose.Types.ObjectId;
    identifier: string;
    value: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const VerificationSchema = new Schema<IVerification>({
    identifier: { type: String, required: true },
    value: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const Verification = mongoose.model<IVerification>("Verification", VerificationSchema);

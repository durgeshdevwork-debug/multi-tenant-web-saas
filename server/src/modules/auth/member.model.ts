import mongoose, { Schema, Document } from "mongoose";

export interface IMember extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    organizationId: mongoose.Types.ObjectId;
    role: string;
    createdAt: Date;
}

const MemberSchema = new Schema<IMember>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    role: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Member = mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema);


import mongoose, { Schema, Document } from "mongoose";

export interface IInvitation extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    inviterId: mongoose.Types.ObjectId;
    organizationId: mongoose.Types.ObjectId;
    teamId?: mongoose.Types.ObjectId;
    role: string;
    status: string;
    expiresAt: Date;
    createdAt: Date;
}

const InvitationSchema = new Schema<IInvitation>({
    email: { type: String, required: true },
    inviterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team" },
    role: { type: String, required: true },
    status: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Invitation = mongoose.models.Invitation || mongoose.model<IInvitation>("Invitation", InvitationSchema);

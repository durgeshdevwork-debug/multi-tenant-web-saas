import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    organizationId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt?: Date;
}

const TeamSchema = new Schema<ITeam>({
    name: { type: String, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const Team = mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);

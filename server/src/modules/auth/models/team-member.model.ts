import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember extends Document {
    _id: mongoose.Types.ObjectId;
    teamId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>({
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});

export const TeamMember = mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);

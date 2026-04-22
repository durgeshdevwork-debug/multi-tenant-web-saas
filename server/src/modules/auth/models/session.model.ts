import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  activeOrganizationId?: mongoose.Types.ObjectId;
  activeTeamId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  activeOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
  activeTeamId: { type: Schema.Types.ObjectId, ref: "Team" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Session = mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);

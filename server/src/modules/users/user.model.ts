import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  stripeCustomerId?: string;
  onboardingStatus?: string;
  createdAt: Date;
  updatedAt: Date;
  // add extra custom fields if needed
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  image: { type: String },
  stripeCustomerId: { type: String },
  onboardingStatus: { type: String, enum: ["not_started", "in_progress", "completed"], default: "not_started" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // add additional fields here
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
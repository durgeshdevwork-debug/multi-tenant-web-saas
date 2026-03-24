import { request } from "http";
import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
    _id: mongoose.Types.ObjectId;
    plan: string;
    CustomerId?: string;
    SubscriptionId?: string;
   //  status types created authenticated ,active, pending, halted, cancelled, completed ,expired
    status: string;
    periodStart?: Date;
    periodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
    cancelAt?: Date;
    canceledAt?: Date;
    endedAt?: Date;
    seats?: number;
    trialStart?: Date;
    trialEnd?: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
    plan: { type: String, required: true },
    CustomerId: { type: String }, //REFER TO USER ID
    SubscriptionId: { type: String }, // REFER TO SUBSCRIPTION ID FROM RAZORPAY PAYMENT GATEWAY 
    status: { type: String, required: true },
    periodStart: { type: Date },
    periodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    cancelAt: { type: Date },
    canceledAt: { type: Date },
    endedAt: { type: Date },
    seats: { type: Number, default: 1 },
    trialStart: { type: Date },
    trialEnd: { type: Date },
});

export const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema);


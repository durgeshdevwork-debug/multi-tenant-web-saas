import { connectDB } from "@configs/db";
import { env } from "@configs/env";
import { User } from "@modules/auth/models/user.model";
import { Account } from "@modules/auth/models/account.model";
import { hashPassword } from "@shared/utils/auth";
import mongoose from "mongoose";

async function createAdmin() {
  try {
    await connectDB();
    const email = env.ADMIN_EMAIL!;
    const password = env.ADMIN_PASSWORD!;
    const name = env.ADMIN_NAME || "Admin";

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
    }

    console.log("Checking if admin user already exists...");
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const userId = new mongoose.Types.ObjectId();
    const hashedPassword = await hashPassword(password);

    await User.create({
      _id: userId,
      email,
      name,
      role: "admin",
      emailVerified: true
    });

    await Account.create({
      userId,
      accountId: "admin",
      providerId: "credential",
      password: hashedPassword
    });

    console.log("Admin user created successfully");
    console.log("Email:", email);

    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error);
    process.exit(1);
  }
}

createAdmin();

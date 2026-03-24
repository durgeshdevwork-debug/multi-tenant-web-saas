import { connectDB } from "@configs/db";
import { env } from "@configs/env";
import { User } from "@modules/users/user.model";
import { auth } from "@shared/utils/auth";

async function createAdmin() {
  try {
    await connectDB();
    const email = env.ADMIN_EMAIL!;
    const password = env.ADMIN_PASSWORD!;
    const name = env.ADMIN_NAME || "Admin";

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
    }

    // check if admin already exists
    const existing = await User.findOne({
      email
    });

    console.log("Checking if admin user already exists...");

    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name
      }
    });

    console.log("Admin user created successfully", result);

     

    console.log("Admin user created successfully");
    console.log("Email:", email);

    process.exit(0);

  } catch (error) {
    console.error("Admin creation failed:", error);
    process.exit(1);
  }
}

createAdmin();
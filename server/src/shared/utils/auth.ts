import { client, db } from "@configs/db";
import { env } from "@configs/env";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { renderPasswordResetEmail } from "@shared/email/renderEmail";
import { sendEmail } from "@shared/email/mailer";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_BASE_URL ?? env.API_BASE_URL,
  secret: env.BETTER_AUTH_SECRET,

  // use Mongo adapter with db (and optional client)[web:154][web:157]
  database: mongodbAdapter(db, {
    client, // optional but recommended for transactions
  }),

  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 60 * 60 * 24,
    sendResetPassword: async ({ user, url }) => {
      const html = await renderPasswordResetEmail({
        name: user.name,
        appName: "Admin Panel",
        resetUrl: url
      });

      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html
      });
    }
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        input: true
      },
      tenantId: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  plugins: [admin()],

  experimental: {
    joins: true, // optional, from docs
  },
  trustedOrigins: [env.CORS_ORIGIN, env.ADMIN_BASE_URL, "http://localhost:5173"].filter(Boolean) as string[],
});

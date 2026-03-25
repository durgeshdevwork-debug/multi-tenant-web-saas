import { client , db } from '@configs/db';
import { env } from '@configs/env';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_BASE_URL ?? env.API_BASE_URL,
  secret: env.BETTER_AUTH_SECRET,

  // use Mongo adapter with db (and optional client)[web:154][web:157]
  database: mongodbAdapter(db, {
    client // optional but recommended for transactions
  }),

  emailAndPassword: {
    enabled: true
  },

  user: {
    additionalFields: {
      tenantId: {
        type: "string",
        required: false,
        input: true,
      }
    }
  },

  plugins: [
    admin()
  ],

  experimental: {
    joins: true // optional, from docs
  }
});

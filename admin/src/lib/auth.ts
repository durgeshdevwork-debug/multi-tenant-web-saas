import { createAuthClient } from "better-auth/react";

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authClient = createAuthClient({
    baseURL: API_BASE_URL
});

export const { useSession, signIn, signOut } = authClient;

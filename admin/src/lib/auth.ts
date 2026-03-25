import { createAuthClient } from "better-auth/react";

const rawBaseUrl = import.meta.env.VITE_AUTH_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_BASE_URL = rawBaseUrl.replace(/\/api\/?$/, '');

export const authClient = createAuthClient({
    baseURL: API_BASE_URL
});

export const { useSession, signOut } = authClient;

export const signInEmail = (payload: { email: string; password: string; rememberMe?: boolean }) => {
    return authClient.signIn.email(payload);
};

import { edge } from "./edge";

export async function renderWelcomeEmail(params: {
  name: string;
  businessName: string;
  appName: string;
  email: string;
  password: string;
  loginUrl: string;
  resetUrl: string;
}) {
  const html = await edge.render("welcome", params);
  return html;
}

export async function renderPasswordResetEmail(params: {
  name: string;
  appName: string;
  resetUrl: string;
}) {
  return await edge.render("password-reset", params);
}

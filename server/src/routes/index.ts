import type { Application } from "express";
import { healthRouter } from "@modules/health/health.routes";
import { adminRouter } from "@modules/admin/admin.routes";
import { contentRouter } from "@modules/content/content.routes";
import { publicRouter } from "@modules/public/public.routes";
import { authRouter } from "@modules/auth/auth.routes";

export function registerRoutes(app: Application) {
  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/content", contentRouter);
  app.use("/api/public", publicRouter);
}

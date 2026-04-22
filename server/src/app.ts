import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "@configs/env";
import { requestLogMiddleware } from "@shared/middlewares/requestLogger";
import { errorHandler } from "@shared/errors/errorHandler";
import { notFound } from "@shared/middlewares/notFound";
import { registerRoutes } from "./routes/index";

export const app = express();

// CORS – can be applied globally
app.use(
  cors({
    origin: env.CORS_ORIGIN ?? "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Now, for the rest of your routes:
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(requestLogMiddleware);

// Register your feature modules
registerRoutes(app);

// 404 + Error handlers
app.use(notFound);
app.use(errorHandler);

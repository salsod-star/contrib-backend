import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import userAuthRoutes from "./users/auth.routes";
import contributionRoutes from "./contribution/routes";
import organizationRoutes from "./organization/routes";

import AppError from "./errors/AppError";
import globalErrorHandler from "./errors/errorController";
import { protect, protectOrg } from "./middlewares/authenticate";
import helmet from "helmet";
import xss from "xss-clean";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Cross-Orgin Request Header
app.use(
  cors({
    origin: "*",
    methods: ["POST", "PUT", "PATCH", "GET", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Parse incoming cookies and save it as a key value pair in the req.cookies obj
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Security headers
app.use(helmet());

// Cross-site attack
app.use(xss());

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", userAuthRoutes);
app.use("/api/v1/organizations", organizationRoutes);
app.use("/api/v1/contributions", protect, protectOrg, contributionRoutes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;

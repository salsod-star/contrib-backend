import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import userAuthRoutes from "./users/auth.routes";
import contributionRoutes from "./contribution/routes";

import AppError from "./errors/AppError";
import globalErrorHandler from "./errors/errorController";
import protect from "./middlewares/authenticate";
import helmet from "helmet";
import xss from "xss-clean";
import path from "path";
import cors from "cors";

const app = express();

// Cross-Orgin Request Header
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["POST", "PUT", "PATCH", "GET", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));

// Security headers
app.use(helmet());

// Cross-site attack
app.use(xss());

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req: Request, res: Response) => {
  res.status(200).render("base");
});
app.use("/api/v1/auth", userAuthRoutes);
app.use("/api/v1/contributions", protect, contributionRoutes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;

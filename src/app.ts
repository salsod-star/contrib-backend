import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import userAuthRoutes from "./users/auth.routes";
import contributionRoutes from "./contribution/routes";

import AppError from "./errors/AppError";
import globalErrorHandler from "./errors/errorController";
import protect from "./middlewares/authenticate";

const app = express();

app.use(express.json());

dotenv.config({ path: "config.env" });

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", userAuthRoutes);
app.use("/api/v1/contributions", protect, contributionRoutes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;

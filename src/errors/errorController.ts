import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";
import sendErrorDev from "./sendErrorDev";
import sendErrorProd from "./sendErrorProd";

const handleJsonWebTokenError = () => {
  return new AppError("Invalid token. Please login again", 400);
};

const handleTokenExpiredError = () => {
  return new AppError("Your token has expired. Please login again", 401);
};

const handleDatabaseDuplicateKeyError = (err: any) => {
  const key = err?.driverError?.detail?.match(/\(([^)]+)\)/);
  console.log(key);

  if (key) {
    const formattedMessage = `The chosen ${key[1]} already exists`;
    return new AppError(formattedMessage, 400);
  }
};

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "JsonWebTokenError") err = handleJsonWebTokenError();
    if (err.name === "TokenExpiredError") err = handleTokenExpiredError();
    if ((err as any)?.driverError?.code === "23505")
      (err as any) = handleDatabaseDuplicateKeyError(err);
    // console.log("eyeah", error);
    sendErrorProd(err, res);
  }
};

export default globalErrorHandler;

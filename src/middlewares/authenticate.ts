import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import jwt from "jsonwebtoken";
import { UserManager } from "../db/managers";

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string = "";

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in. Please login to get access!", 401)
      );
    }

    const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`) as {
      id: string;
      iat: number;
      exp: number;
    };

    const user = await UserManager.findOneBy({ id: decodedToken.id });

    if (!user?.isActive) {
      return next(
        new AppError("The user that owns this token no longer exists.", 403)
      );
    }

    req.user = user;

    next();
  }
);

export default protect;

import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import jwt from "jsonwebtoken";
import { OrganizationManager, UserManager } from "../db/managers";

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string = req.cookies?.userJWT;

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

    if (!user) {
      return next(
        new AppError("The user that owns this token no longer exists.", 403)
      );
    }

    req.user = user;

    next();
  }
);

export const protectOrg = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.orgJWT;

    if (!token) {
      return next(
        new AppError(
          "You need to sign into the organization to get access",
          401
        )
      );
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as {
      id: string;
      iat: number;
      exp: number;
    };

    const organization = await OrganizationManager.findOneBy({
      id: decoded.id,
    });

    if (!organization) {
      return next(
        new AppError(
          "The organization that this token belongs to can't be found",
          403
        )
      );
    }

    req.userOrg = organization;

    next();
  }
);

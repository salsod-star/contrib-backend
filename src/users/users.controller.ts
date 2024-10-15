import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { UserManager } from "../db/managers";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserManager.find();

    res.status(200).json({
      status: "success",
      total: users.length,
      data: {
        users,
      },
    });
  }
);

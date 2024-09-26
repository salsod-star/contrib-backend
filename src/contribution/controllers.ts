import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export const createContribution = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      status: "success",
      data: {
        message: "contribution created successfully",
      },
    });
  }
);

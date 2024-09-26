import { NextFunction, Request, Response } from "express";
import { UserLoginDto, UserSignupDto } from "../dtos/userRequest.dto";
import { User } from "../db/models/user";
import { UserManager } from "../db/managers";
import getHashedPassword from "../utils/encryptPassword";
import catchAsync from "../utils/catchAsync";
import { UserResponseDto } from "../dtos/userResponse.dto";
import AppError from "../errors/AppError";
import isPasswordMatch from "../utils/decryptPassword";
import generateToken from "../utils/generateToken";
import { generatePasswordResetToken } from "../utils/generatePasswordResetToken";

export const createUser = catchAsync(
  async (
    req: Request<{}, {}, UserSignupDto>,
    res: Response,
    next: NextFunction
  ) => {
    const hashedPassword = getHashedPassword(req.body.password);

    const newUser = new User();

    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.email = req.body.email;
    newUser.username = req.body.username;
    newUser.password = hashedPassword;

    const user = await UserManager.save(newUser);

    const userResp: UserResponseDto = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    };

    res.status(200).json({
      status: "success",
      data: {
        user: { ...userResp },
      },
    });
  }
);

export const login = catchAsync(
  async (
    req: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body.email || !req.body.password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await UserManager.findOneBy({ email: req.body.email });

    if (!user) {
      return next(new AppError("User does not exit", 404));
    }

    const isMatch = isPasswordMatch(req.body.password, user.password);

    if (!isMatch) {
      return next(
        new AppError("Incorrect email and password. Please try again", 401)
      );
    }

    const token = generateToken({ id: user.id });

    res.status(200).json({
      status: "success",
      token,
    });
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body?.email) {
      return next(
        new AppError("Please provide your registered email address", 400)
      );
    }

    const user = await UserManager.findOneBy({ email: req.body.email });

    if (!user) {
      return next(
        new AppError("There is no registered user with that email", 404)
      );
    }

    const { token, hashedToken, tokenExpiresAt } = generatePasswordResetToken();

    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpires = tokenExpiresAt;
  }
);

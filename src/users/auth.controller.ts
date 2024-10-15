import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import {
  changePasswordDto,
  passwordResetParamsTokenDto,
  updatePasswordDto,
  UserLoginDto,
  UserSignupDto,
} from "../dtos/userRequest.dto";
import { User } from "../db/models/user";
import { UserManager } from "../db/managers";
import catchAsync from "../utils/catchAsync";
import { UserResponseDto } from "../dtos/userResponse.dto";
import AppError from "../errors/AppError";
import isPasswordMatch from "../utils/decryptPassword";
import { generatePasswordResetToken } from "../utils/generatePasswordResetToken";
import { sendMail } from "../utils/sendEmail";
import { MoreThan } from "typeorm";
import generateHashedPassword from "../utils/encryptPassword";
import { filterBody } from "../utils/filterUserFields";
import createAndSendToken from "../utils/createAndSendToken";
import jwt from "jsonwebtoken";

export const createUser = catchAsync(
  async (
    req: Request<{}, {}, UserSignupDto>,
    res: Response,
    next: NextFunction
  ) => {
    const hashedPassword = generateHashedPassword(req.body.password);

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

    createAndSendToken(user.id, res);
  }
);

export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("jwt", "", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({
      status: "success",
    });
  }
);

export const isLoggedIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.jwt) {
      const decoded: any = jwt.verify(
        req.cookies.jwt,
        `${process.env.JWT_SECRET}`
      );

      const currentUser = await UserManager.findOneBy({ id: decoded?.id });

      if (!currentUser) {
        return res.status(401).json({
          status: "fail",
          message: "Login expires. Please login again",
        });
      }

      res.status(200).json({
        status: "success",
        data: currentUser,
      });
    }

    res.status(400).json({
      status: "fail",
      message: "Credentials not found",
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

    await UserManager.save(user);

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/resetPassword/${token}`;

    const message = `Forgot your password? Click the link below to make a new one.\n\n${resetUrl}\n\nDo note that the link will expire in the next 10 minutes. If you didn't initiate this request. kindly ignore this mail.`;

    try {
      await sendMail({
        from: "contrib",
        subject: "Password reset",
        to: "salsodiou@gmail.com",
        text: message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email successfully",
      });
    } catch (err) {
      user.passwordResetToken = "";
      user.passwordResetTokenExpires = null;

      await UserManager.save(user);

      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (
    req: Request<passwordResetParamsTokenDto, {}, changePasswordDto>,
    res: Response,
    next: NextFunction
  ) => {
    const resetToken = req.params.resetToken;

    if (!resetToken) {
      return next(new AppError("Token is required. Try again!", 400));
    }

    const hashedtoken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await UserManager.findOneBy({
      passwordResetToken: hashedtoken,
      passwordResetTokenExpires: MoreThan(new Date()),
    });

    if (!user) {
      return next(new AppError("Invalid token or token has expired", 401));
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return next(
        new AppError("The passwords you entered are not the same", 400)
      );
    }

    const hashedPassword = generateHashedPassword(req.body.password);

    user.password = hashedPassword;
    user.passwordResetToken = "";
    user.passwordResetTokenExpires = null;

    await UserManager.save(user);

    createAndSendToken(user.id, res);
  }
);

export const updatePassword = catchAsync(
  async (
    req: Request<{}, {}, updatePasswordDto>,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.user?.id;

    if (!id) {
      return next(
        new AppError("You are not logged in. Please login and try again", 403)
      );
    }

    const user = await UserManager.findOneBy({ id });

    if (!user) {
      return next(new AppError("The user does not exist", 404));
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return next(
        new AppError("The new passwords you entered are not the same", 400)
      );
    }

    const isCorrectPassword = isPasswordMatch(
      req.body.currentPassword,
      user.password
    );

    if (!isCorrectPassword) {
      return next(new AppError("Your current password is not correct", 401));
    }

    const hashedPassword = generateHashedPassword(req.body.password);

    user.password = hashedPassword;

    await UserManager.save(user);

    createAndSendToken(user.id, res);
  }
);

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;

    if (!id) {
      return next(
        new AppError("You are not logged in. Please login and try again", 403)
      );
    }

    const user = await UserManager.findOneBy({ id });

    if (!user) {
      return next(new AppError("The user does not exist", 404));
    }

    const filteredBody = filterBody({ ...user }, "username");

    const newUser = await UserManager.update(id, filteredBody);

    res.status(200).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  }
);

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const user = await UserManager.findOneBy({ id: userId });

    if (!user) {
      return next(new AppError("The user does not exist", 404));
    }

    user.isActive = false;

    await UserManager.save(user);

    res.status(204).json({
      status: "success",
    });
  }
);

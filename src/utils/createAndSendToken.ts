import { Response } from "express";
import generateToken from "./generateToken";

function createAndSendToken(id: string, res: Response) {
  const token = generateToken({ id });

  let isProd: boolean = false;

  if (process.env.NODE_ENV === "development") {
    isProd = false;
  } else if (process.env.NODE_ENV === "production") {
    isProd = true;
  }

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
}
export default createAndSendToken;

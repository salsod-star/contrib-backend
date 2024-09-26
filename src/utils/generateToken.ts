import jwt from "jsonwebtoken";

type tokenPayload = {
  id: string;
};

const generateToken = (payload: tokenPayload) => {
  const token = jwt.sign(payload, `${process.env.JWT_SECRET}`, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

export default generateToken;

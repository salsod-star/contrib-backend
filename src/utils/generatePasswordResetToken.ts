import crypto from "crypto";

type generatePasswordResetTokenProps = {
  token: string;
  hashedToken: string;
  tokenExpiresAt: Date;
};

export const generatePasswordResetToken =
  (): generatePasswordResetTokenProps => {
    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const tokenExpiresAt = new Date(Date.now() + 20 * 60 * 1000);

    return { token, hashedToken, tokenExpiresAt };
  };

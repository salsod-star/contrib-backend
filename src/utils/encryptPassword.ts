import bcrypt from "bcryptjs";

const generateHashedPassword = (password: string): string => {
  const hashedPassword = bcrypt.hashSync(password, 12);

  return hashedPassword;
};

export default generateHashedPassword;

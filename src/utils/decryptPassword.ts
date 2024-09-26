import bcrypt from "bcryptjs";

const isPasswordMatch = (password: string, hashedPwd: string): boolean => {
  console.log(password, hashedPwd);
  return bcrypt.compareSync(password, hashedPwd);
};

export default isPasswordMatch;

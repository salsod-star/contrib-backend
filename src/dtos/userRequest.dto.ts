export interface UserSignupDto {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface changePasswordDto {
  password: string;
  passwordConfirm: string;
}

export interface updatePasswordDto {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

export interface passwordResetParamsTokenDto {
  resetToken: string;
}

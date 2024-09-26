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

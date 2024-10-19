import { UserResponseDto } from "./src/dtos/userResponse.dto";

declare global {
  namespace Express {
    interface Request {
      user?: UserResponseDto | undefined;
      userOrg?: any;
    }
  }
}

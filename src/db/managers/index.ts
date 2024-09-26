import { AppDataSource } from "../config/setup";
import { User } from "../models/user";

export const UserManager = AppDataSource.getRepository(User);

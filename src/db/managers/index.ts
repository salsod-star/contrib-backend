import { AppDataSource } from "../config/setup";
import { Contribution } from "../models/contribution";
import { Organization } from "../models/organization";
import { OrganizationSetting } from "../models/organizationSettings";
import { User } from "../models/user";

export const UserManager = AppDataSource.getRepository(User);
export const OrganizationManager = AppDataSource.getRepository(Organization);
export const OrganizationSettingManager =
  AppDataSource.getRepository(OrganizationSetting);
export const ContribtuionManager = AppDataSource.getRepository(Contribution);

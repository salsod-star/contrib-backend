import { DataSource } from "typeorm";
import { User } from "../models/user";
import { Organization } from "../models/organization";
import { OrganizationSetting } from "../models/organizationSettings";
import { Contribution } from "../models/contribution";
import { Membership } from "../models/membership";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "salsod",
  database: "contrib",
  synchronize: true,
  entities: [User, Organization, OrganizationSetting, Contribution, Membership],
  subscribers: [],
  migrations: [],
});

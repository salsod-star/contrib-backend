import { DataSource } from "typeorm";
import { User } from "../models/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "salsod",
  database: "contrib",
  synchronize: true,
  // logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});

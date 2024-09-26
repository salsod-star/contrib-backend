import { AppDataSource } from "./config/setup";

export default async function DBInit() {
  try {
    const source = await AppDataSource.initialize();

    console.log("Database connection successful");
  } catch (error) {
    console.log(error);
  }
}

import dotenv from "dotenv";
import DBInit from "./db/init";

dotenv.config({ path: "config.env" });
import app from "./app";

DBInit();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Starting ${process.env.NODE_ENV} server on port ${PORT}`);
});

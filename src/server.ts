import app from "./app";
import DBInit from "./db/init";

DBInit();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Starting ${process.env.NODE_ENV} server on port ${PORT}`);
});

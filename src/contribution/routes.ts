import { Router } from "express";
import { createContribution } from "./controllers";
import protect from "../middlewares/authenticate";

const router = Router();

router.route("/").post(createContribution);

export default router;

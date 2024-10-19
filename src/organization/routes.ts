import express from "express";
import { createOrganization, siginIntoOrganization } from "./controllers";
import { protect } from "../middlewares/authenticate";

const router = express.Router();

router.route("/").post(protect, createOrganization);

router.route("/:organizationId").post(protect, siginIntoOrganization);

export default router;

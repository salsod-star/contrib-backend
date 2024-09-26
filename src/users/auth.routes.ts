import { Router } from "express";
import { createUser, login } from "./auth.controller";
import { getAllUsers } from "./users.controller";

const router = Router();

router.post("/signup", createUser);
router.post("/login", login);

router.route("/users").get(getAllUsers);

export default router;

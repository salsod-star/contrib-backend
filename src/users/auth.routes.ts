import { Request, Response, Router } from "express";
import {
  createUser,
  deleteMe,
  forgotPassword,
  isLoggedIn,
  login,
  logout,
  resetPassword,
  updateMe,
  updatePassword,
} from "./auth.controller";
import { getAllUsers } from "./users.controller";
import protect from "../middlewares/authenticate";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  limit: 1000,
  windowMs: 60 * 60 * 1000,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      status: "fail",
      message:
        "Too many request made from this IP address. Try again after an hour!",
    });
  },
});

const router = Router();

router.post("/signup", createUser);
router.post("/login", limiter, login);
router.get("/logout", logout);
router.get("/isLoggedIn", isLoggedIn);

router.post("/forgotPassword", forgotPassword);
router.patch("/updatePassword", protect, updatePassword);
router.patch("/resetPassword/:resetToken", resetPassword);
router.patch("/updateMe", protect, updateMe);
router.patch("/deleteMe", protect, deleteMe);

router.route("/users").get(getAllUsers);

export default router;

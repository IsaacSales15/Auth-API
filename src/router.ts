import { Router } from "express";
import {
  registerUser,
  getUsers,
  deleteUsers,
} from "./controllers/UserController";
import { resendCode } from "./controllers/CodeResend";
import { verifyUser } from "./controllers/VerifyController";

export const router = Router();

router.post("/user", registerUser);
router.post("/resend-code", resendCode);
router.get("/users", getUsers);
router.delete("/delete-users", deleteUsers);
router.post("/verify", verifyUser);

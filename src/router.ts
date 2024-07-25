import { Router } from "express";
import { createUser, getUsers, deleteUsers } from "./controllers/UserController";
import { resendCode } from "./controllers/CodeResend";

export const router = Router();

router.post("/user", createUser);
router.post("/resend-code", resendCode);
router.get("/users", getUsers);
router.delete("/delete-users", deleteUsers);
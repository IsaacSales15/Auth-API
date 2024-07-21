import { Router } from "express";
import { createUser } from "./controllers/UserController";

export const router = Router();

router.post("/user", createUser);
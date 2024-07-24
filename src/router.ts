import { Router } from "express";
import { createUser, getUsers } from "./controllers/UserController";

export const router = Router();

router.post("/user", createUser);
router.get("/users", getUsers);
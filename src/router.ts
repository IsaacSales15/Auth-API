import { Router } from "express";
import { createUser, getUsers, deleteUsers } from "./controllers/UserController";

export const router = Router();

router.post("/user", createUser);
router.get("/users", getUsers);
router.delete("/delete-users", deleteUsers);
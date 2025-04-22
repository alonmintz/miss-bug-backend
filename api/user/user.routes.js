import express from "express";
import { userController } from "./user.controller.js";

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:userId", userController.getUser);
router.put("/:userId", userController.updateUser);
router.post("/", userController.addUser);
router.delete("/:userId", userController.removeUser);

export const userRoutes = router;

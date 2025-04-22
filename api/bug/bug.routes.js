import express from "express";
import { bugController } from "./bug.controller.js";

const router = express.Router();

router.get("/", bugController.getBugs);
router.get("/:bugId", bugController.getBug);
router.put("/:bugId", bugController.updateBug);
router.post("/", bugController.addBug);
router.delete("/:bugId", bugController.removeBug);

export const bugRoutes = router;

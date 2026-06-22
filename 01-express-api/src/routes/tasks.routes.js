import { Router } from "express";

const router = Router();
import { createTask, getTaskById, getTasks } from "../controllers/tasks.controller.js";
import { authGuard } from "../middlewares/guard.js";
import { validate } from "../middlewares/validate.js";

router.get("/", getTasks)
router.post("/", authGuard, validate, createTask)
router.get("/:id", getTaskById)

export default router;
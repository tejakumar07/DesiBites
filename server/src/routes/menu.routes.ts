import { Router } from "express";
import { getMenu, getItem } from "../controllers/menu.controller";

const router = Router();

router.get("/", getMenu);
router.get("/:id", getItem);

export default router;

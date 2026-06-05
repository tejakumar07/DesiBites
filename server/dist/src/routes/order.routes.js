import { Router } from "express";
import { gettingStatusOfOrder, placeOrder, updatingStatusOfOrder, } from "../controllers/order.controller";
import { gettingOrders } from "../controllers/order.controller";
const router = Router();
router.post("/", placeOrder);
router.get("/:id", gettingOrders);
router.get("/:id/status", gettingStatusOfOrder);
router.patch("/:id/status", updatingStatusOfOrder);
export default router;

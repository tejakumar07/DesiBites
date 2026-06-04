import { z } from "zod";
import { Request, Response } from "express";
import {
  orderingFood,
  getOrdersByID,
  getStatus,
} from "../services/order.services";
import { calculateStatus } from "../utils/order.utill";

const orderSchema = z.object({
  name: z.string(),
  address: z.string().min(10).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, {
    error: "Please Enter a valid Mobile Number",
  }),

  items: z
    .array(
      z.object({
        menuItemId: z.number().int().positive().max(25),
        quantity: z.number().int().positive().max(100),
      }),
    )
    .min(1, {
      error: "Minimum 1 item is required",
    }),
});

async function placeOrder(req: Request, res: Response) {
  try {
    const result = orderSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Check Your Inputs",
      });
    }
    const { name, address, phone, items } = req.body;
    const order = await orderingFood({ name, address, phone, items });

    res.status(201).json({
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to place order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function gettingOrders(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const order = await getOrdersByID(id);

    if (!order) {
      res.status(400).json({
        message: "Orders Not Found",
      });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get orders",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function gettingStatusOfOrder(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const order = await getStatus(id);

    if (!order) {
      return res.status(404).json({
        message: "Order Not Found",
      });
    }

    const status = calculateStatus(order.createdAt);
    res.json({
      orderId: order.id,
      status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get order Status",
    });
  }
}

export { placeOrder, gettingOrders, gettingStatusOfOrder };

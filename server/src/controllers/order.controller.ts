import { z } from "zod";
import { Request, Response } from "express";
import {
  orderingFood,
  getOrdersByID,
  getStatus,
  updateOrderStatus,
} from "../services/order.services";
import { calculateStatus } from "../utils/order.utill";

const orderSchema = z.object({
  name: z.string(),
  address: z.string().min(10).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, {
    message: "Please Enter a valid Mobile Number",
  }),

  items: z
    .array(
      z.object({
        menuItemId: z.number().int().positive(),
        quantity: z.number().int().positive().max(100),
      }),
    )
    .min(1, {
      message: "Minimum 1 item is required",
    }),
});

const statusUpdateSchema = z.object({
  status: z.enum(["Order Received", "Preparing", "Out for Delivery", "Delivered"]),
});

async function placeOrder(req: Request, res: Response) {
  try {
    const result = orderSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid inputs",
        errors: result.error.flatten().fieldErrors,
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

    let status = order.status;
    if (status === "Order Received") {
      status = calculateStatus(order.createdAt);
    }

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

async function updatingStatusOfOrder(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = statusUpdateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid status value",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { status } = result.data;
    const order = await updateOrderStatus(id, status);

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export { placeOrder, gettingOrders, gettingStatusOfOrder, updatingStatusOfOrder };

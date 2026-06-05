import { Request, Response } from "express";
import { getMenuItems, getItemById } from "../services/menu.services";

async function getMenu(req: Request, res: Response) {
  try {
    const menu = await getMenuItems();
    res.status(200).json({
      menu,
    });
  } catch (error) {
    console.error("Failed to get menu:", error);
    res.status(500).json({
      message: "Failed to get menu",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function getItem(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid item ID" });
      return;
    }

    const item = await getItemById(id);

    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    res.status(200).json({
      item,
    });
  } catch (error) {
    console.error("Failed to get item:", error);
    res.status(500).json({
      message: "Failed to get item",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export { getMenu, getItem };

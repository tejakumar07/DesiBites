import { getMenuItems, getItemById } from "../services/menu.services";
async function getMenu(req, res) {
    try {
        const menu = await getMenuItems();
        res.status(200).json({
            menu,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to get menu",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
async function getItem(req, res) {
    try {
        const id = Number(req.params.id);
        const item = await getItemById(id);
        res.status(200).json({
            item,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to get item",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export { getMenu, getItem };

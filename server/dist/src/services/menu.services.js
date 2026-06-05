import { prisma } from "../config/prisma";
async function getMenuItems() {
    return prisma.menuItem.findMany();
}
async function getItemById(id) {
    return prisma.menuItem.findUnique({
        where: {
            id,
        },
    });
}
export { getMenuItems, getItemById };

import { prisma } from "../config/prisma";

async function getMenuItems() {
  return prisma.menuItem.findMany();
}

async function getItemById(id: number) {
  return prisma.menuItem.findUnique({
    where: {
      id,
    },
  });
}

export { getMenuItems, getItemById };

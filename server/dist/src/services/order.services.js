import { prisma } from "../config/prisma";
async function orderingFood(input) {
    return prisma.order.create({
        data: {
            customerName: input.name,
            address: input.address,
            phone: input.phone,
            items: {
                create: input.items.map((item) => ({
                    quantity: item.quantity,
                    menuItem: {
                        connect: {
                            id: item.menuItemId,
                        },
                    },
                })),
            },
        },
    });
}
async function getOrdersByID(id) {
    const order = await prisma.order.findUnique({
        where: {
            id,
        },
        include: {
            items: {
                include: {
                    menuItem: true,
                },
            },
        },
    });
    if (!order) {
        return null;
    }
    const totalPrice = order.items.reduce((total, item) => total + item.quantity * item.menuItem.price, 0);
    return {
        ...order,
        totalPrice,
    };
}
async function getStatus(id) {
    return prisma.order.findUnique({
        where: {
            id,
        },
    });
}
async function updateOrderStatus(id, status) {
    return prisma.order.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
}
export { orderingFood, getOrdersByID, getStatus, updateOrderStatus };

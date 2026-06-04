import { prisma } from "../config/prisma";

interface OrderItemInput {
  menuItemId: number;
  quantity: number;
}

interface OrderingInput {
  name: string;
  address: string;
  phone: string;

  items: OrderItemInput[];
}

async function orderingFood(input: OrderingInput) {
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

async function getOrdersByID(id: number) {
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

  const totalPrice = order.items.reduce(
    (total, item) => total + item.quantity * item.menuItem.price,
    0,
  );

  return {
    ...order,
    totalPrice,
  };
}

async function getStatus(id: number) {
  return prisma.order.findUnique({
    where: {
      id,
    },
  });
}

export { orderingFood, getOrdersByID, getStatus };

import { prisma } from "../src/config/prisma";

interface InputTypes {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
}

async function seedDatabase() {
  console.log("Clearing existing orders and order items...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  console.log("Clearing existing menu items...");
  await prisma.menuItem.deleteMany({});
  
  const menuItems: InputTypes[] = [
    {
      name: "Margherita Pizza",
      description: "Classic hand-stretched crust topped with fresh mozzarella cheese, rich tomato sauce, and fresh basil.",
      price: 399.99,
      imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=600",
      isVeg: true,
    },
    {
      name: "Chicken Burger",
      description: "Crispy grilled chicken patty served with custom house sauce, lettuce, and onions on a toasted bun.",
      price: 199.99,
      imageUrl: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=600",
      isVeg: false,
    },
    {
      name: "French Fries",
      description: "Perfectly seasoned, golden, and crispy potato fries served with classic tomato ketchup.",
      price: 99.99,
      imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600",
      isVeg: true,
    },
    {
      name: "Classic Chicken Burger",
      description: "Juicy chicken patty with melted cheddar, crisp lettuce, tomato, and house sauce on a toasted sesame bun.",
      price: 220.0,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
      isVeg: false,
    },
    {
      name: "Paneer Tikka Roll",
      description: "Spiced chargrilled paneer cubes wrapped in a soft paratha with mint chutney and crunchy pickled onions.",
      price: 180.0,
      imageUrl: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600",
      isVeg: true,
    },
    {
      name: "Veg Hyderabadi Biryani",
      description: "Aromatic basmati rice cooked with garden-fresh vegetables, mint, and exotic Indian spices on slow dum.",
      price: 299.0,
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600",
      isVeg: true,
    },
    {
      name: "Chocolate Brownie",
      description: "Rich, dense, and fudgy warm chocolate brownie made with premium dark chocolate.",
      price: 149.0,
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600",
      isVeg: true,
    },
    {
      name: "Aloo Paratha",
      description: "Whole wheat flatbread stuffed with spiced mashed potatoes, griddled with butter, served with pickle.",
      price: 90.0,
      imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600",
      isVeg: true,
    },
    {
      name: "Chicken 65",
      description: "Fiery, deep-fried chicken cubes marinated in south-indian spices, yogurt, and curry leaves.",
      price: 210.0,
      imageUrl: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&q=80&w=600",
      isVeg: false,
    },
    {
      name: "Palak Paneer",
      description: "Soft fresh cottage cheese cubes simmered in a silky, spiced spinach gravy with a touch of fresh cream.",
      price: 299.9,
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600",
      isVeg: true,
    },
  ];

  console.log("Seeding menu items...");
  for (const item of menuItems) {
    const created = await prisma.menuItem.create({
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        isVeg: item.isVeg,
      },
    });
    console.log(`Seeded: ${created.name}`);
  }
  console.log("Seeding completed successfully!");
}

seedDatabase()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Note: Since prisma is imported, we don't need manual disconnect here unless required,
    // but the script will naturally terminate.
  });

import { prisma } from "../src/config/prisma";

interface InputTypes {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

async function addingItemsInMenu({
  name,
  description,
  price,
  imageUrl,
}: InputTypes) {
  const addingMenuItems = await prisma.menuItem.create({
    data: {
      name,
      description,
      price,
      imageUrl,
    },
  });
  console.log(addingMenuItems);
}

addingItemsInMenu({
  name: "Margherita Pizza",
  description: "Classic cheese pizza",
  price: 399.99,
  imageUrl: "https://google.com",
});
addingItemsInMenu({
  name: "Chicken Burger",
  description: "Grilled chicken burger",
  price: 199.99,
  imageUrl: "https://google.com",
});
addingItemsInMenu({
  name: "French Fries",
  description: "Crispy Potato fries",
  price: 99.99,
  imageUrl: "https://google.com",
});

addingItemsInMenu({
  name: "Classic Chicken Burger",
  description:
    "Juicy chicken patty with melted cheddar, crisp lettuce, tomato, and house sauce on a toasted bun.",
  price: 220.0,
  imageUrl: "https://google.com",
});

addingItemsInMenu({
  name: "Paneer Tikka Roll",
  description:
    "Spiced paneer cubes wrapped in a soft paratha with mint chutney and crunchy onions.",
  price: 180.0,
  imageUrl: "https://google.com",
});

addingItemsInMenu({
  name: "Veg Hyderabadi Biryani",
  description:
    "Aromatic basmati rice cooked with garden-fresh vegetables, herbs, and exotic Indian spices.",
  price: 299.0,
  imageUrl: "https://google.com",
});

addingItemsInMenu({
  name: "Chocolate Brownie",
  description: "Dense, fudgy chocolate brownie served warm.",
  price: 149.0,
  imageUrl: "https://google.com",
});

addingItemsInMenu({
  name: "Aloo Paratha",
  description:
    "Whole wheat flatbread stuffed with a spiced mashed potato filling, served with a dollop of butter and tangy pickle.",
  price: 90.0,
  imageUrl: "https://google.com",
});

addingItemsInMenu({
  name: "Chicken 65",
  description:
    "Spicy, deep-fried chicken appetizer marinated with ginger, garlic, and red chili, popular as a street food snack.",
  price: 210.0,
  imageUrl: "https://google.com",
});

addingItemsInMenu({
  name: "Palak Paneer",
  description:
    "Soft cubes of cottage cheese simmered in a smooth, spiced spinach puree with a touch of cream.",
  price: 299.9,
  imageUrl: "https://google.com",
});

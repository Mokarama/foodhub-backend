import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("Seeding meals...");

  // First, create a provider user (required for meals)
  const provider = await prisma.user.upsert({
    where: { email: "provider@foodhub.com" },
    update: {},
    create: {
      email: "provider@foodhub.com",
      name: "Food Provider",
      password: await bcrypt.hash("password123", 10),
      role: "PROVIDER",
    },
  });

  console.log("Provider created/updated:", provider.id);

  // Get categories
  const fastFood = await prisma.category.findUnique({
    where: { name: "Fast Food" },
  });
  const dessert = await prisma.category.findUnique({
    where: { name: "Dessert" },
  });
  const shop = await prisma.category.findUnique({
    where: { name: "Shop" },
  });

  if (!fastFood || !dessert || !shop) {
    console.error("Categories not found. Please run seed-cats.ts first.");
    process.exit(1);
  }

  // Sample meals
  const meals = [
    {
      name: "Gourmet Burger",
      price: 450,
      description: "A delicious juicy burger with fresh veggies and melted cheese.",
      image: "/uploads/foods/burger.jpg",
      categoryId: fastFood.id,
    },
    {
      name: "Fresh Salmon Sushi",
      price: 550,
      description: "Premium raw salmon served with soy sauce and wasabi.",
      image: "/uploads/foods/sushi.jpg",
      categoryId: fastFood.id,
    },
    {
      name: "Wood-fired Pizza",
      price: 650,
      description: "Authentic Italian pizza baked in a traditional wood-fired oven.",
      image: "/uploads/foods/pizza.jpg",
      categoryId: fastFood.id,
    },
    {
      name: "Chocolate Cake",
      price: 250,
      description: "Rich and moist chocolate cake with chocolate frosting.",
      image: "/uploads/foods/burger.jpg",
      categoryId: dessert.id,
    },
    {
      name: "Strawberry Cheesecake",
      price: 300,
      description: "Creamy cheesecake with fresh strawberry topping.",
      image: "/uploads/foods/sushi.jpg",
      categoryId: dessert.id,
    },
    {
      name: "Organic Salad Mix",
      price: 200,
      description: "Fresh organic vegetables mixed with our special dressing.",
      image: "/uploads/foods/pizza.jpg",
      categoryId: shop.id,
    },
  ];

  for (const meal of meals) {
    const existing = await prisma.meal.findFirst({
      where: { name: meal.name },
    });

    if (!existing) {
      await prisma.meal.create({
        data: {
          ...meal,
          providerId: provider.id,
        },
      });
      console.log(`✓ Created meal: ${meal.name}`);
    } else {
      console.log(`✓ Meal already exists: ${meal.name}`);
    }
  }

  const allMeals = await prisma.meal.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      category: { select: { name: true } },
    },
  });

  console.log("\n✅ All seeded meals:");
  console.log(JSON.stringify(allMeals, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // --- 1. Admin User ---
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@foodhub.com" },
    update: {},
    create: {
      email: "admin@foodhub.com",
      name: "Platform Admin",
      password: adminPassword,
      role: Role.ADMIN,
      status: "ACTIVE",
    },
  });
  console.log("Admin user created/verified");

  // --- 2. Categories ---
  const categories = [
    "Fast Food",
    "Italian",
    "Japanese",
    "Dessert",
    "Beverages",
    "Indian",
    "Healthy",
  ];

  for (const catName of categories) {
    await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName },
    });
  }
  console.log("Categories seeded");

  // --- 3. Providers & Meals ---
  const providerPassword = await bcrypt.hash("provider123", 10);
  const providers = [
    { name: "Burger King", email: "bk@foodhub.com" },
    { name: "Pizza Hut", email: "ph@foodhub.com" },
    { name: "Sushi Zen", email: "sushi@foodhub.com" },
  ];

  for (const p of providers) {
    const provider = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: {
        email: p.email,
        name: p.name,
        password: providerPassword,
        role: Role.PROVIDER,
        status: "ACTIVE",
      },
    });

    // Create a profile for each
    await prisma.providerProfile.upsert({
      where: { userId: provider.id },
      update: {},
      create: {
        userId: provider.id,
        bio: `Authentic ${p.name} food delivered fast.`,
        address: "123 Food St, Gourmet City",
        phone: "+1234567890",
      },
    });
  }
  console.log("Providers seeded");

  // --- 4. Food Images (Slider) ---
  const foodImages = [
    { title: "Gourmet Burger", url: "/uploads/foods/burger.jpg" },
    { title: "Fresh Sushi", url: "/uploads/foods/sushi.jpg" },
    { title: "Wood-fired Pizza", url: "/uploads/foods/pizza.jpg" },
  ];

  for (const img of foodImages) {
    await prisma.foodImage.create({
      data: {
        title: img.title,
        url: img.url,
        description: "Delicious and fresh",
      },
    });
  }
  console.log("Food images seeded");

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

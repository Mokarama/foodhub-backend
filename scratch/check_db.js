const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
  const images = await prisma.foodImage.findMany();
  console.log("Food Images in DB:", images.length);
  console.log(JSON.stringify(images, null, 2));
  await prisma.$disconnect();
}

check();

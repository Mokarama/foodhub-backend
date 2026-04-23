import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const meals = await prisma.meal.findMany({
    select: {
      id: true,
      name: true,
      image: true
    }
  });
  console.log('Meals in DB:', JSON.stringify(meals, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

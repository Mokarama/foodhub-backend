import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories...');
  
  const categories = [
    { name: 'Fast Food' },
    { name: 'Dessert' },
    { name: 'Shop' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  const allCats = await prisma.category.findMany();
  console.log('Final Categories:', JSON.stringify(allCats, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

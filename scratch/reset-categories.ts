import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Database Category Reset ---');

  // To delete categories, we must first delete meals that reference them.
  // And to delete meals, we must delete reviews, wishlist items, and order items.
  
  console.log('Cleaning up dependent data...');
  await prisma.review.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.orderItem.deleteMany({});
  
  console.log('Deleting existing meals...');
  await prisma.meal.deleteMany({});

  console.log('Deleting existing categories...');
  await prisma.category.deleteMany({});

  console.log('Seeding new categories...');
  const categories = [
    { name: 'Fast Food' },
    { name: 'Dessert' },
    { name: 'Shop' }
  ];

  for (const cat of categories) {
    await prisma.category.create({
      data: cat
    });
  }

  const allCats = await prisma.category.findMany();
  console.log('Successfully seeded categories:', allCats.map(c => c.name).join(', '));
  console.log('------------------------------');
}

main()
  .catch(e => {
    console.error('Reset failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

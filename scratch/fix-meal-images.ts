import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Updating meals to use valid image paths...');
  
  // Update "Pizza" and "pizza" to use a valid pizza image
  const result = await prisma.meal.updateMany({
    where: {
      name: {
        contains: 'pizza',
        mode: 'insensitive'
      }
    },
    data: {
      image: '/uploads/foods/pizza.jpg'
    }
  });

  console.log(`Updated ${result.count} meals.`);

  // Check for other meals and assign them default valid images if needed
  const meals = await prisma.meal.findMany();
  for (const meal of meals) {
    if (meal.image.startsWith('/uploads/foods/food-')) {
       // These are likely broken references to non-existent files
       let newImage = '/uploads/foods/burger.jpg'; // default
       if (meal.name.toLowerCase().includes('sushi')) newImage = '/uploads/foods/sushi.jpg';
       if (meal.name.toLowerCase().includes('pizza')) newImage = '/uploads/foods/pizza.jpg';
       
       await prisma.meal.update({
         where: { id: meal.id },
         data: { image: newImage }
       });
       console.log(`Fixed image for meal: ${meal.name}`);
    }
  }

  console.log('✅ Done fixing meal images.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

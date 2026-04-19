import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", discountType: "PERCENTAGE", value: 10 },
  });

  await prisma.coupon.upsert({
    where: { code: "MINUS50" },
    update: {},
    create: { code: "MINUS50", discountType: "FIXED", value: 50 },
  });

  console.log("Coupons seeded!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
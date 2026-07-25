import { PrismaClient } from '@prisma/client';
import { seedDemoData } from '../lib/seedDemoData';

const prisma = new PrismaClient();

seedDemoData(prisma)
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

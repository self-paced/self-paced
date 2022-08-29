import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

(async () => {
  console.log('Seeding...');
  await ['local', 'demo35', 'futsunoshop'].map(async (projectId) => {
    await prisma.account.create({
      data: {
        projectId,
      },
    });
  });
})();

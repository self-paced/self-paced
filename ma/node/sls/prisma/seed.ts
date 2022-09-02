import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

(async () => {
  console.log('Seeding...');
  await ['local', 'demo35', 'futsunoshop'].map(async (projectId) => {
    await prisma.account.upsert({
      where: {
        projectId: projectId,
      },
      update: {},
      create: {
        projectId: projectId,
      },
    });
  });

  const emptyMessageScheduleIds = await prisma.messageEvent.findMany({
    where: {
      messageScheduleId: undefined,
    },
  });

  emptyMessageScheduleIds.map(async (messageEvent) => {
    const messageSchedule = await prisma.messageSchedule.create({
      data: {
        title: messageEvent.title,
        content: messageEvent.content as Prisma.JsonObject,
        deliveryScheduleAt: messageEvent.createdAt,
        status: 'done',
        account: {
          connect: {
            projectId: 'demo35', // todo こちら一時的なので決め打ち
          },
        },
      },
    });

    await prisma.messageEvent.update({
      where: {
        id: messageEvent.id,
      },
      data: {
        messageScheduleId: messageSchedule.id,
      },
    });
  });

  console.log('Seed Complete!');
})();

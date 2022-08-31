import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';

const message = createRouter()
  .query('list', {
    input: z.object({
      page: z.number().min(1),
      perPage: z.number().min(1).optional(),
      sortData: z
        .object({
          field: z.string().min(1),
          direction: z.string().min(1),
        })
        .optional(),
    }),
    output: z.object({
      messages: z.array(
        z.object({
          id: z.string(),
          sendCount: z.number(),
          readCount: z.number(),
          uniqClickCount: z.number(),
          orderCount: z.number(),
          orderTotal: z.number(),
          type: z.string(),
          segment: z.any(),
          content: z.any(),
          title: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      ),
      meta: z.object({
        count: z.number(),
        page: z.number().min(1),
        perPage: z.number().min(1),
        totalPages: z.number().min(1),
      }),
    }),
    resolve: async ({ input, ctx: { prisma, jwt } }) => {
      const { page, perPage } = input;
      const perPageDefault = 10;
      const perPageMax = 100;
      const perPageValue = perPage
        ? Math.min(perPage, perPageMax)
        : perPageDefault;
      const skip = (page - 1) * perPageValue;
      const sortData = input.sortData || {
        field: 'createdAt',
        direction: 'desc',
      };
      const [count, messages] = await prisma.$transaction([
        prisma.messageEvent.count({
          where: {
            projectId: jwt.projectId,
          },
        }),
        prisma.messageEvent.findMany({
          skip,
          take: perPageValue,
          orderBy: {
            [sortData.field]: sortData.direction,
          },
          where: {
            projectId: jwt.projectId,
          },
        }),
      ]);
      return {
        messages :await Promise.all(messages.map(async(message) => ({
          id: message.id,
          sendCount: await prisma.userMessageEvent.count({
            where: {
              messageEventId: message.id,
            },
          }),
          readCount: await prisma.userMessageEvent.count({
            where: {
              messageEventId: message.id,
              NOT : [{readAt: null}],
            },
          }),
          uniqClickCount: await prisma.userMessageEvent.count({
            where: {
              messageEventId: message.id,
              userMessageLinks: {
                some: {
                  UserMessageLinkActivities: {
                    some: {
                      type: 'click',
                    },
                  },
                },
              },
            },
          }),
          orderCount: await prisma.userMessageLinkActivity.count({
            where: {
              type: 'cv',
              userMessageLink: {
                userMessageEvent: {
                  messageEventId: message.id
                }
              }
            },
          }),
          orderTotal: 0,
          // orderTotal: (await prisma.userMessageLinkActivity.groupBy({
          //   by: ['type'],
          //   _sum: {
          //     orderTotal: true,
          //   },
          //   where: {
          //     type: 'cv',
          //     userMessageLink: {
          //       userMessageEvent: {
          //         messageEventId: message.id
          //       }
          //     }
          //   },
          // })),
          type: 'スポット', // TODO: dbに入れる
          segment: 'message.segment', // TODO: dbに入れる
          content: message.content,
          title: message.title,
          createdAt: message.createdAt.toISOString(),
          updatedAt: message.updatedAt.toISOString(),
        }))),
        meta: {
          count,
          page,
          perPage: perPageValue,
          totalPages: Math.ceil(count / perPageValue) || 1,
        },
      };
    },
  })
  .query('event', {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      return await ctx.prisma.messageEvent.findFirst({
        where: {
          id: input.id,
          projectId: ctx.jwt.projectId,
        },
      });
    },
  })
  .query('listTargets', {
    input: z.object({
      messageId: z.string(),
      page: z.number().min(1),
      perPage: z.number().min(1).optional(),
      sortData: z
        .object({
          field: z.string().min(1),
          direction: z.string().min(1),
        })
        .optional(),
    }),
    resolve: async ({ input, ctx }) => {
      const { page, perPage } = input;
      const perPageDefault = 10;
      const perPageMax = 100;
      const perPageValue = perPage
        ? Math.min(perPage, perPageMax)
        : perPageDefault;
      const skip = (page - 1) * perPageValue;
      const sortData = input.sortData || {
        field: 'createdAt',
        direction: 'desc',
      };
      const where = {
        messageEvent: {
          id: input.messageId,
          projectId: ctx.jwt.projectId,
        },
      };
      const [count, targets] = await ctx.prisma.$transaction([
        ctx.prisma.userMessageEvent.count({
          where,
        }),
        ctx.prisma.userMessageEvent.findMany({
          skip,
          take: perPageValue,
          orderBy: {
            [sortData.field]: sortData.direction,
          },
          where,
          include: {
            userMessageLinks: {
              include: {
                UserMessageLinkActivities: true,
              },
            },
          },
        }),
      ]);
      return {
        targets: targets,
        meta: {
          count,
          page,
          perPage: perPageValue,
          totalPages: Math.ceil(count / perPageValue) || 1,
        },
      };
    },
  });

export default message;

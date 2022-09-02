import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

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
      try {
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
          messages: await Promise.all(
            messages.map(async (message) => ({
              id: message.id,
              sendCount: await prisma.userMessageEvent.count({
                where: {
                  messageEventId: message.id,
                },
              }),
              readCount: await prisma.userMessageEvent.count({
                where: {
                  messageEventId: message.id,
                  NOT: [{ readAt: null }],
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
                      messageEventId: message.id,
                    },
                  },
                },
              }),
              orderTotal:
                (
                  await prisma.userMessageLinkActivity.groupBy({
                    by: ['type'],
                    _sum: {
                      orderTotal: true,
                    },
                    where: {
                      type: 'cv',
                      userMessageLink: {
                        userMessageEvent: {
                          messageEventId: message.id,
                        },
                      },
                    },
                  })
                )[0]?._sum.orderTotal ?? 0,
              type: 'スポット', // TODO: dbに入れる
              segment: 'message.segment', // TODO: dbに入れる
              content: message.content,
              title: message.title,
              createdAt: message.createdAt.toISOString(),
              updatedAt: message.updatedAt.toISOString(),
            }))
          ),
          meta: {
            count,
            page,
            perPage: perPageValue,
            totalPages: Math.ceil(count / perPageValue) || 1,
          },
        };
      } catch (e) {
        console.error(e);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .query('event', {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      try {
        const messageEvent = await ctx.prisma.messageEvent.findFirst({
          where: {
            id: input.id,
            projectId: ctx.jwt.projectId,
          },
        });
        if (!messageEvent) throw new TRPCError({ code: 'NOT_FOUND' });
        return messageEvent;
      } catch (e) {
        console.error(e);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .query('eventAggregations', {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      try {
        const res = await ctx.prisma.messageEvent.findFirst({
          where: {
            id: input.id,
            projectId: ctx.jwt.projectId,
          },
          include: {
            userMessageEvents: {
              take: 1,
              include: {
                userMessageLinks: true,
              },
            },
          },
        });
        if (!res) throw new TRPCError({ code: 'NOT_FOUND' });
        const { userMessageEvents, ...messageEvent } = res;
        // map to unique originalLinks
        const uniqueLinks =
          userMessageEvents[0]?.userMessageLinks
            .map((dbLink) => dbLink.originalLink)
            .filter((value, index, self) => self.indexOf(value) === index) ??
          [];
        return {
          uniqClickCount: await ctx.prisma.userMessageEvent.count({
            where: {
              messageEventId: messageEvent.id,
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
          sendCount: await ctx.prisma.userMessageEvent.count({
            where: {
              messageEventId: messageEvent.id,
            },
          }),
          readCount: await ctx.prisma.userMessageEvent.count({
            where: {
              messageEventId: messageEvent.id,
              NOT: [{ readAt: null }],
            },
          }),
          orderCount: await ctx.prisma.userMessageLinkActivity.count({
            where: {
              type: 'cv',
              userMessageLink: {
                userMessageEvent: {
                  messageEventId: messageEvent.id,
                },
              },
            },
          }),
          orderTotal:
            (
              await ctx.prisma.userMessageLinkActivity.groupBy({
                by: ['type'],
                _sum: {
                  orderTotal: true,
                },
                where: {
                  type: 'cv',
                  userMessageLink: {
                    userMessageEvent: {
                      messageEventId: messageEvent.id,
                    },
                  },
                },
              })
            )[0]?._sum.orderTotal ?? 0,
          links: await Promise.all(
            uniqueLinks.map(async (link) => ({
              link,
              uniqClickCount: Number(
                (
                  (await ctx.prisma.$queryRaw`
                      SELECT
                        COUNT(*) as _count
                      FROM
                        (
                          SELECT
                            DISTINCT UserMessageLink.userMessageEventId
                          FROM
                            UserMessageLink
                            INNER JOIN UserMessageEvent ON UserMessageLink.userMessageEventId = UserMessageEvent.id
                            INNER JOIN UserMessageLinkActivity ON UserMessageLink.id = UserMessageLinkActivity.userMessageLinkId
                          WHERE
                            UserMessageLink.originalLink = ${link}
                            AND UserMessageEvent.messageEventId = ${messageEvent.id}
                            AND UserMessageLinkActivity.type = 'click'
                        ) as tmp;
                  `) as {
                    _count: number;
                  }[]
                )[0]?._count ?? 0
              ),
              orderCount: await ctx.prisma.userMessageLinkActivity.count({
                where: {
                  type: 'cv',
                  userMessageLink: {
                    originalLink: link,
                    userMessageEvent: {
                      messageEventId: messageEvent.id,
                    },
                  },
                },
              }),
              orderTotal:
                (
                  await ctx.prisma.userMessageLinkActivity.groupBy({
                    by: ['type'],
                    _sum: {
                      orderTotal: true,
                    },
                    where: {
                      type: 'cv',
                      userMessageLink: {
                        originalLink: link,
                        userMessageEvent: {
                          messageEventId: messageEvent.id,
                        },
                      },
                    },
                  })
                )[0]?._sum.orderTotal ?? 0,
            }))
          ),
        };
      } catch (e) {
        console.error(e);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    },
  })
  .query('eventTargets', {
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

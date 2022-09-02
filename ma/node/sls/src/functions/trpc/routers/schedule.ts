/* eslint-disable max-depth */
import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { lineMessageSchema } from './publisher';

const schedule = createRouter()
  .mutation('create', {
    input: z.object({
      title: z.string().min(1),
      segmentTitle: z.string().min(1),
      token: z.string().min(1),
      messages: lineMessageSchema,
    }),
    resolve: async ({ input, ctx }) => {
      try {
        // メッセージスケジュールを登録する
        await ctx.prisma.messageSchedule.create({
          data: {
            title: input.title,
            segmentId: input.token,
            segmentTitle: input.segmentTitle,
            deliveryScheduleAt: new Date(),
            content: JSON.stringify(input.messages),
            account: {
              connect: {
                projectId: ctx.jwt.projectId,
              },
            },
          },
        });
      } catch (e) {
        console.error(e);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
      return true;
    },
  })
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
          prisma.messageSchedule.count({
            where: {
              projectId: jwt.projectId,
            },
          }),
          prisma.messageSchedule.findMany({
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
              title: message.title,
              content: message.content,
              type: 'スポット',
              segment: message.segmentTitle,
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
  });

export default schedule;

import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';
import { Client, Message } from '@line/bot-sdk';
import { TRPCError } from '@trpc/server';
import ecforceApi from '../../../libs/helpers/ecforceApi';
import config from '../../../libs/config';

const client = new Client({
  channelAccessToken: config.lineToken,
});

const MAX_MESSAGES = 5;
const MAX_CAROUSEL_COLUMNS = 10;
const MAX_CAROUSEL_ACTIONS = 3;

const lineTextMessageSchema = z.object({
  type: z.literal('text'),
  text: z.string().min(1),
});
const lineImageMessageSchema = z.object({
  type: z.literal('image'),
  originalContentUrl: z.string().url(),
  previewImageUrl: z.string().url(),
});
const lineVideoMessageSchema = z.object({
  type: z.literal('video'),
  originalContentUrl: z.string().url(),
  previewImageUrl: z.string().url(),
});
const lineRichMessageSchema = z.object({
  type: z.literal('flex'),
  altText: z.string().min(1),
  contents: z.object({
    type: z.literal('bubble'),
    size: z.literal('giga'),
    hero: z.object({
      type: z.literal('image'),
      url: z.string().min(1).url(),
      size: z.literal('full'),
      aspectRatio: z.literal('1:1'),
      aspectMode: z.literal('cover'),
      action: z.object({
        type: z.literal('uri'),
        uri: z.string().min(1).url(),
      }),
    }),
  }),
});
const lineCarouselMessageSchema = z.object({
  type: z.literal('template'),
  altText: z.string().min(1),
  template: z.object({
    type: z.literal('carousel'),
    columns: z
      .array(
        z.object({
          thumbnailImageUrl: z.string().url(),
          imageBackgroundColor: z.string().optional(),
          title: z.string().optional(),
          text: z.string().min(1),
          defaultAction: z.object({
            type: z.literal('uri'),
            label: z.string().min(1),
            uri: z.string().url(),
          }),
          actions: z
            .array(
              z.object({
                type: z.literal('uri'),
                label: z.string().min(1),
                uri: z.string().min(1),
              })
            )
            .min(1)
            .max(MAX_CAROUSEL_ACTIONS),
        })
      )
      .min(1)
      .max(MAX_CAROUSEL_COLUMNS),
  }),
});

export const lineMessageSchema = z
  .array(
    z.union([
      lineTextMessageSchema,
      lineImageMessageSchema,
      lineVideoMessageSchema,
      lineRichMessageSchema,
      lineCarouselMessageSchema,
    ])
  )
  .min(1)
  .max(MAX_MESSAGES);

const publisher = createRouter().mutation('push', {
  input: z.object({
    title: z.string().min(1),
    segmentTitle: z.string().min(1),
    token: z.string().min(1),
    messages: lineMessageSchema,
  }),
  // eslint-disable-next-line max-lines-per-function
  resolve: async ({ input, ctx }) => {
    let page = 1;
    let totalPages: number;
    try {
      // page loop: セグメントのすべての顧客を取得する
      do {
        const res = await ecforceApi.listCustomersFromSegment(ctx, {
          token: input.token,
          page,
        });
        totalPages = res.meta.total_pages;

        const messageEvent = await ctx.prisma.messageEvent.create({
          data: {
            title: input.title,
            segmentId: input.token,
            segmentTitle: input.segmentTitle,
            content: JSON.stringify(input.messages),
            account: {
              connect: {
                projectId: ctx.jwt.projectId,
              },
            },
          },
        });
        // customer loop: ページのすべての顧客に対してメッセージを送信する
        await Promise.all(
          res.data.map(async (customer) => {
            if (customer.attributes.line_id) {
              await ctx.prisma.userMessageEvent.create({
                data: {
                  userId: customer.id,
                  lineId: customer.attributes.line_id,
                  email: customer.attributes.email,
                  userNumber: customer.attributes.number,
                  messageEvent: {
                    connect: {
                      id: messageEvent.id,
                    },
                  },
                },
              });
              await client.pushMessage(
                customer.attributes.line_id,
                input.messages as Message[]
              );
            }
          })
        );
      } while (page++ < totalPages);
    } catch (e) {
      console.error(e);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
    return true;
  },
});

export default publisher;

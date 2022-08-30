/* eslint-disable max-depth */
import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';
import { Client, Message } from '@line/bot-sdk';
import { TRPCError } from '@trpc/server';
import ecforceApi, { getOrigin } from '../../../libs/helpers/ecforceApi';
import config from '../../../libs/config';
import shortUUID from 'short-uuid';
import { Context } from '../context';

const shortTranslator = shortUUID();

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

type LineMessage = z.infer<typeof lineMessageSchema>;

const publisher = createRouter().mutation('push', {
  input: z.object({
    title: z.string().min(1),
    segmentTitle: z.string().min(1),
    token: z.string().min(1),
    messages: lineMessageSchema,
  }),
  resolve: async ({ input, ctx }) => {
    let page = 1;
    let totalPages: number;
    try {
      // メッセージイベントを登録する
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
      // page loop: セグメントのすべての顧客を取得する
      do {
        const res = await ecforceApi.listCustomersFromSegment(ctx, {
          token: input.token,
          page,
        });
        totalPages = res.meta.total_pages;
        // customer loop: ページのすべての顧客に対してメッセージを送信する
        await Promise.all(
          res.data.map(async (customer) => {
            try {
              if (customer.attributes.line_id) {
                // リレーションの情報を顧客と結合
                const attr = res.included.find(
                  (item) =>
                    item.id === customer.relationships.billing_address.data.id
                )?.attributes;
                // ユーザごとのメッセージイベントを登録する
                const userMessageEvent =
                  await ctx.prisma.userMessageEvent.create({
                    data: {
                      lineId: customer.attributes.line_id,
                      email: customer.attributes.email,
                      userId: customer.id,
                      userNumber: customer.attributes.number,
                      name: attr?.name01
                        ? attr?.name01 + (attr?.name02 ? ` ${attr.name02}` : '')
                        : '',
                      messageEvent: {
                        connect: {
                          id: messageEvent.id,
                        },
                      },
                    },
                  });
                try {
                  // リンクを書き換える
                  const newMessages = await handleLinks(
                    input.messages,
                    userMessageEvent.id,
                    ctx
                  );
                  // メッセージを送信する
                  await client.pushMessage(
                    customer.attributes.line_id,
                    newMessages as Message[]
                  );
                } catch (e) {
                  // 失敗した場合イベントスタータスを更新する
                  await ctx.prisma.userMessageEvent.update({
                    where: {
                      id: userMessageEvent.id,
                    },
                    data: {
                      status: 'failure',
                    },
                  });
                  throw e;
                }
              }
            } catch (e) {
              console.error(e);
              console.error('Failed for customer:', customer.attributes.number);
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

const handleLinks = async (
  messages: LineMessage,
  userMessageEventId: string,
  ctx: Context
) => {
  const newMessages = JSON.parse(JSON.stringify(messages));
  const cusionUrl = `${getOrigin(ctx)}/admin/ma/sls/${process.env.ENV}/cusion`;
  for (const message of newMessages) {
    switch (message.type) {
      // 【テキストメッセージ】
      case 'text':
        // リンクを見つける
        const links = message.text.match(/https?:\/\/[^\s]+/g);
        if (links) {
          for (const link of links) {
            const dbLink = await ctx.prisma.userMessageLink.create({
              data: {
                originalLink: link,
                userMessageEvent: {
                  connect: {
                    id: userMessageEventId,
                  },
                },
              },
            });
            // リンクを書き換える
            message.text = message.text.replace(
              link,
              `${cusionUrl}/${shortTranslator.fromUUID(dbLink.id)}`
            );
          }
        }
        break;
      // 【リッチメッセージ】
      case 'flex':
        const link = message.contents.hero.action.uri;
        const dbLink = await ctx.prisma.userMessageLink.create({
          data: {
            originalLink: link,
            userMessageEvent: {
              connect: {
                id: userMessageEventId,
              },
            },
          },
        });
        // リンクを書き換える
        message.contents.hero.action.uri = `${cusionUrl}/${shortTranslator.fromUUID(
          dbLink.id
        )}`;
        break;
      // 【カルーセルメッセージ】
      case 'template':
        for (const column of message.template.columns) {
          // デフォルトリンク
          const link = column.defaultAction.uri;
          const dbLink = await ctx.prisma.userMessageLink.create({
            data: {
              originalLink: link,
              userMessageEvent: {
                connect: {
                  id: userMessageEventId,
                },
              },
            },
          });
          // リンクを書き換える
          column.defaultAction.uri = `${cusionUrl}/${shortTranslator.fromUUID(
            dbLink.id
          )}`;
          // アクションリンク
          for (const actions of column.actions) {
            const link = actions.uri;
            const dbLink = await ctx.prisma.userMessageLink.create({
              data: {
                originalLink: link,
                userMessageEvent: {
                  connect: {
                    id: userMessageEventId,
                  },
                },
              },
            });
            // リンクを書き換える
            actions.uri = `${cusionUrl}/${shortTranslator.fromUUID(dbLink.id)}`;
          }
        }
        break;
    }
  }
  return newMessages;
};

export default publisher;

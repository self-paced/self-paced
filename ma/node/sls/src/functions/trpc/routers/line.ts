import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';
import config from '@libs/config';
import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: config.lineToken,
});

const MESSAGES_SCHEMA = z.array(z.string()).min(1).max(5);

const line = createRouter()
  .mutation('push', {
    input: z.object({
      userId: z.string(),
      messages: MESSAGES_SCHEMA,
    }),
    resolve: async ({ input }) => {
      await client.pushMessage(
        input.userId,
        input.messages.map((message) => ({
          type: 'text',
          text: message,
        }))
      );
      return true;
    },
  })
  .mutation('multicast', {
    input: z.object({
      userIds: z.array(z.string()).min(1),
      messages: MESSAGES_SCHEMA,
    }),
    resolve: async ({ input }) => {
      await client.multicast(
        input.userIds,
        input.messages.map((message) => ({
          type: 'text',
          text: message,
        }))
      );
      return true;
    },
  })
  .mutation('broadcast', {
    input: z.object({
      messages: MESSAGES_SCHEMA,
    }),
    resolve: async ({ input }) => {
      await client.broadcast(
        input.messages.map((message) => ({
          type: 'text',
          text: message,
        }))
      );
      return true;
    },
  })
  .mutation('narrowcast', {
    input: z.object({
      sex: z.union([z.literal('male'), z.literal('female')]),
    }),
    resolve: ({ input }) => {
      // TODO: implement method
      return {
        ...input,
      };
    },
  });

export default line;

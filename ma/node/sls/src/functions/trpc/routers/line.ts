import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';
import config from '@libs/config';
import { Client, DemographicFilterObject } from '@line/bot-sdk';
import { TRPCError } from '@trpc/server';

const client = new Client({
  channelAccessToken: config.lineToken,
});

const MESSAGES_SCHEMA = z.array(z.string()).min(1).max(5);
const AGE_SCHEMA = z.union([
  z.literal('age_15'),
  z.literal('age_20'),
  z.literal('age_25'),
  z.literal('age_30'),
  z.literal('age_35'),
  z.literal('age_40'),
  z.literal('age_45'),
  z.literal('age_50'),
]);

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
      gender: z.union([z.literal('male'), z.literal('female')]).nullish(),
      age: z
        .object({ gte: AGE_SCHEMA.nullish(), lt: AGE_SCHEMA.nullish() })
        .nullish(),
      messages: MESSAGES_SCHEMA,
    }),
    resolve: async ({ input }) => {
      const demographicFilter: DemographicFilterObject = {
        type: 'operator',
        and: [],
      };
      if (input.age?.gte || input.age?.lt) {
        demographicFilter.and.push({
          type: 'age',
          gte: input.age?.gte ?? undefined,
          lt: input.age?.lt ?? undefined,
        });
      }
      if (input.gender) {
        demographicFilter.and.push({
          type: 'gender',
          oneOf: [input.gender],
        });
      }
      try {
        await client.narrowcast(
          input.messages.map((message) => ({
            type: 'text',
            text: message,
          })),
          {
            type: 'audience',
            audienceGroupId: 4656785539347,
          },
          demographicFilter.and.length
            ? {
                demographic: demographicFilter,
              }
            : undefined
        );
      } catch (e) {
        console.error(e);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
      return true;
    },
  });

export default line;
import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';
import { Client, DemographicFilterObject } from '@line/bot-sdk';
import { TRPCError } from '@trpc/server';
import { lineMessageSchema } from './publisher';
import { env } from '../../../libs/config/env';

const client = new Client({
  channelAccessToken: env.LINE_TOKEN,
});

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
      messages: lineMessageSchema,
    }),
    resolve: async ({ input }) => {
      await client.pushMessage(input.userId, input.messages);
      return true;
    },
  })
  .mutation('multicast', {
    input: z.object({
      title: z.string().min(1),
      userIds: z.array(z.string()).min(1),
      messages: lineMessageSchema,
    }),
    resolve: async ({ input }) => {
      await client.multicast(input.userIds, input.messages);
      return true;
    },
  })
  .mutation('broadcast', {
    input: z.object({
      messages: lineMessageSchema,
    }),
    resolve: async ({ input }) => {
      await client.broadcast(input.messages);
      return true;
    },
  })
  .mutation('narrowcast', {
    input: z.object({
      title: z.string().min(1),
      gender: z.union([z.literal('male'), z.literal('female')]).nullish(),
      age: z
        .object({ gte: AGE_SCHEMA.nullish(), lt: AGE_SCHEMA.nullish() })
        .nullish(),
      messages: lineMessageSchema,
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
          input.messages,
          undefined,
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

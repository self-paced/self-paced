import { createRouter } from '../../trpc/createRouter';
import ecforceApi from '../../../libs/helpers/ecforceApi';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

const segmentListResponseSchema = z.array(
  z.object({
    id: z.number(),
    token: z.string().min(1),
    name: z.string().min(1),
  })
);

const segment = createRouter().query('list', {
  output: segmentListResponseSchema,
  resolve: async ({ ctx }) => {
    console.log(ctx);
    try {
      const res = await ecforceApi.listSegments(ctx);
      return res.data.map((segment) => ({
        id: segment.attributes.id,
        token: segment.attributes.token,
        name: segment.attributes.name,
      }));
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'セグメント一覧取得に失敗しました。',
      });
    }
  },
});

export default segment;

import { createRouter } from '../../trpc/createRouter';
import { env } from '../../../libs/config/env';
import { dSegmentListResponse } from '../../../libs/helpers/dummyData';
import ecforceApi from '@libs/helpers/ecforceApi';
import { z } from 'zod';

const segmentListResponseSchema = z.array(
  z.object({
    id: z.number(),
    token: z.string().min(1),
    name: z.string().min(1),
  })
);

export type SegmentListResponse = z.infer<typeof segmentListResponseSchema>;

const segment = createRouter().query('list', {
  output: segmentListResponseSchema,
  resolve: async ({ ctx }) => {
    if (env.NODE_ENV === 'development') {
      return dSegmentListResponse;
    }
    const res = await ecforceApi.listSegments(ctx);
    return res.data.map((segment) => ({
      id: segment.attributes.id,
      token: segment.attributes.token,
      name: segment.attributes.name,
    }));
  },
});

export default segment;

import { createRouter } from '../../trpc/createRouter';
import ecforceApi from '../../../libs/helpers/ecforceApi';
import { z } from 'zod';

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
    const res = await ecforceApi.listSegments(ctx);
    return res.data.map((segment) => ({
      id: segment.attributes.id,
      token: segment.attributes.token,
      name: segment.attributes.name,
    }));
  },
});

export default segment;

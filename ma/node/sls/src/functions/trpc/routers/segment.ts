import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';
import { env } from '../../../libs/config/env';
import { dummyData } from '../../../libs/helpers/dummyData';

const segment = createRouter().query('list', {
  input: z.object({
    page: z.number(),
  }),
  resolve: async ({ input, ctx: { req, jwt } }) => {
    if (env.NODE_ENV === 'development') {
      return dummyData.segments;
    }
    // セグメント一覧取得
    const url = `${req.headers.origin}/api/v2/admin/search_queries?page=${input.page}&per=100&type=customer`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token token="${jwt.ecfToken}"`,
      },
    });
    const json = await res.json();
    return json.data.map((segment: any) => ({
      id: segment.attributes.id,
      token: segment.attributes.token,
      name: segment.attributes.name,
    })) as typeof dummyData.segments;
  },
});

export default segment;

import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';

const segment = createRouter()
  .query('list', {
    input: z.object({
      page: z.number(),
    }),
    resolve: async ({ input }) => {
      console.log(input.page);

      // セグメント一覧取得
      //
      // const url = "https://development.ec-force.com/api/v2/admin/customer_segments?page=input.page";

      // const res = await fetch(url, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // });

      // const segments = await res.json();
      const segments = {
        data: [
          {
            "id": "1",
            "token": "15407622-2adb-4f47-a1c9-5c23bbe57b64",
            "name": "segment A",
            "user_counts": 1,
            "line_counts": 1
          },
          {
            "id": "2",
            "token": "6c118f31-510f-4560-aa78-d6934e39dca4",
            "name": "segment B",
            "user_counts": 3,
            "line_counts": 3
          }
        ],
        "meta": {
          "total_count": 3,
          "page": 1,
          "per": 2,
          "count": 2,
          "total_pages": 2
        },
        links: {
          "self": "http://localhost:5050/local/segment.list?input={\"page\":1}",
          "prev": null,
          "first": "http://localhost:5050/local/segment.list?input={\"page\":1}",
          "next": "http://localhost:5050/local/segment.list?input={\"page\":2}",
          "last": "http://localhost:5050/local/segment.list?input={\"page\":2}"
        }
      }

      return {
        segments: segments
      };
    },
  });

export default segment;

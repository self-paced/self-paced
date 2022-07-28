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
            "name": "segment A - 村上",
            "userCounts": 1,
            "lineCounts": 1
          },
          {
            "id": "2",
            "token": "6c118f31-510f-4560-aa78-d6934e39dca4",
            "name": "segment B - ハヴィ、河端、菊池",
            "userCounts": 3,
            "lineCounts": 3
          },
          {
            "id": "3",
            "token": "54703b4b-c618-4088-80ea-49c5c99d5b7e",
            "name": "segment C - 中川",
            "userCounts": 1,
            "lineCounts": 1
          }
        ],
        "meta": {
          "totalCount": 4,
          "page": 1,
          "per": 3,
          "count": 3,
          "totalPages": 2
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

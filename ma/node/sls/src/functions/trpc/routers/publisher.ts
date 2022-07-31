import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';
import config from '../../../../src/libs/config';
import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: config.lineToken,
});

const publisher = createRouter().mutation('push', {
  input: z.object({
    segmentId: z.string(),
    messages: z.array(z.string()).min(1).max(5),
  }),
  resolve: async ({ input }) => {
    console.log(input.segmentId);

    // セグメント結果取得
    //
    // const url = "https://development.ec-force.com/api/v2/admin/customers?q_token=:segmentId";

    // const res = await fetch(url, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // });

    // const userIds = await res.json();

    let userIds = [];

    switch (input.segmentId) {
      case '15407622-2adb-4f47-a1c9-5c23bbe57b64':
        // 村上
        userIds = ['U047bb714204750b1fac84038db302a12'];
        break;
      case '6c118f31-510f-4560-aa78-d6934e39dca4':
        // ハヴィ、河端、菊池
        userIds = [
          'Uabe224d99d896c04a0fc5730a8c58cb4',
          'U54e5269306edf7d6a33fe44099a02fe2',
          'U97e07eaecdc08925a9bec89f31216e08',
        ];
        break;
      case '54703b4b-c618-4088-80ea-49c5c99d5b7e':
        // 中川
        userIds = ['U2b5ef79a4c8085f615df92b7753a9e83'];
        break;
      default:
        return false;
    }

    await Promise.all(
      userIds.map(async (userId) => {
        await client.pushMessage(
          userId,
          input.messages.map((message) => ({
            type: 'text',
            text: message,
          }))
        );
      })
    );

    return true;
  },
});

export default publisher;

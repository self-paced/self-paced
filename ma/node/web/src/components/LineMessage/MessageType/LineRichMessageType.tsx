import { z } from 'zod';
import v from '../../../utils/validation';

export const lineRichMessageSchema = z.object({
  type: z.literal('flex'),
  altText: z
    .string()
    .min(1, { message: v.MESSAGES.required('通知のテキスト') }),
  contents: z.object({
    type: z.literal('bubble'),
    size: z.literal('giga'),
    hero: z.object({
      type: z.literal('image'),
      url: z
        .string()
        .min(1, { message: v.MESSAGES.required('画像URL') })
        .url({ message: v.MESSAGES.url('画像URL') }),
      size: z.literal('full'),
      aspectRatio: z.literal('1:1'),
      aspectMode: z.literal('cover'),
      action: z.object({
        type: z.literal('uri'),
        uri: z
          .string()
          .min(1, {
            message: v.MESSAGES.required('アクションリンク'),
          })
          .url({ message: v.MESSAGES.url('アクションリンク') }),
      }),
    }),
  }),
});

type LineRichMessageType = z.infer<typeof lineRichMessageSchema>;

export default LineRichMessageType;

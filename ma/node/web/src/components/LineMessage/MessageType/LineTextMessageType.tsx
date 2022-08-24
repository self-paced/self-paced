import { TextArea } from '@super_studio/ecforce_ui_albers';
import { ChangeEvent } from 'react';
import { z } from 'zod';
import { MessageComponent } from '.';
import v from '../../../utils/validation';

export const lineTextMessageSchema = z.object({
  type: z.literal('text'),
  text: z.string().min(1, { message: v.MESSAGES.required('メッセージ') }),
});

type LineTextMessageType = z.infer<typeof lineTextMessageSchema>;

export default LineTextMessageType;

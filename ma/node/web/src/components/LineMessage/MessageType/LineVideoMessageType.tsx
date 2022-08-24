import { z } from 'zod';
import { InputLabel, TextField } from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '.';
import { ChangeEvent } from 'react';
import v from '../../../utils/validation';

export const lineVideoMessageSchema = z.object({
  type: z.literal('video'),
  originalContentUrl: z
    .string()
    .min(1, { message: v.MESSAGES.required('動画URL') })
    .url({ message: v.MESSAGES.url('動画URL') }),
  previewImageUrl: z
    .string()
    .min(1, { message: v.MESSAGES.required('プレビュー画像URL') })
    .url({ message: v.MESSAGES.url('プレビュー画像URL') }),
});

type LineVideoMessageType = z.infer<typeof lineVideoMessageSchema>;

export default LineVideoMessageType;

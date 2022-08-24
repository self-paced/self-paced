import { z } from 'zod';
import { InputLabel, TextField } from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '.';
import { ChangeEvent } from 'react';
import v from '../../../utils/validation';

export const lineImageMessageSchema = z.object({
  type: z.literal('image'),
  originalContentUrl: z
    .string()
    .min(1, { message: v.MESSAGES.required('画像URL') })
    .url({ message: v.MESSAGES.url('画像URL') }),
  previewImageUrl: z
    .string()
    .min(1, { message: v.MESSAGES.required('プレビュー画像URL') })
    .url({ message: v.MESSAGES.url('プレビュー画像URL') }),
});

type LineImageMessageType = z.infer<typeof lineImageMessageSchema>;

export default LineImageMessageType;

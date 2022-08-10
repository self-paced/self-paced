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

export type LineImageMessageType = z.infer<typeof lineImageMessageSchema>;

export const DEFAULT_IMAGE_MESSAGE = Object.freeze<LineImageMessageType>({
  type: 'image',
  originalContentUrl: '',
  previewImageUrl: '',
});

const LineImageMessage: MessageComponent<LineImageMessageType> = ({
  messageDetails,
  onChange,
  errors,
}) => {
  return (
    <div>
      <InputLabel>画像URL</InputLabel>
      <TextField
        value={messageDetails.originalContentUrl}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newMessageDetails = { ...messageDetails };
          newMessageDetails.originalContentUrl = e.target.value;
          onChange && onChange(newMessageDetails);
        }}
        error={errors?.originalContentUrl}
      />
      <InputLabel>プレビュー画像URL</InputLabel>
      <TextField
        value={messageDetails.previewImageUrl}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newMessageDetails = { ...messageDetails };
          newMessageDetails.previewImageUrl = e.target.value;
          onChange && onChange(newMessageDetails);
        }}
        error={errors?.previewImageUrl}
      />
    </div>
  );
};

export default LineImageMessage;

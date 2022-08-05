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

export type LineVideoMessageType = z.infer<typeof lineVideoMessageSchema>;

export const DEFAULT_VIDEO_MESSAGE = Object.freeze<LineVideoMessageType>({
  type: 'video',
  originalContentUrl: '',
  previewImageUrl: '',
});

const LineVideoMessage: MessageComponent<LineVideoMessageType> = ({
  messageDetails,
  onChange,
  errors,
}) => {
  return (
    <div>
      <InputLabel>動画URL</InputLabel>
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

export default LineVideoMessage;

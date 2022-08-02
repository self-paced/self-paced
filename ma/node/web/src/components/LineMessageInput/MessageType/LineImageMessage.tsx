import { z } from 'zod';
import { InputLabel, TextField } from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '.';
import { ChangeEvent } from 'react';

export const lineImageMessageSchema = z.object({
  type: z.literal('image'),
  originalContentUrl: z.string().url(),
  previewImageUrl: z.string().url(),
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
      />
      <InputLabel>プレビュー画像URL</InputLabel>
      <TextField
        value={messageDetails.previewImageUrl}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newMessageDetails = { ...messageDetails };
          newMessageDetails.previewImageUrl = e.target.value;
          onChange && onChange(newMessageDetails);
        }}
      />
    </div>
  );
};

export default LineImageMessage;

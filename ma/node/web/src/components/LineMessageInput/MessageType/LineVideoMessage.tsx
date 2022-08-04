import { z } from 'zod';
import { InputLabel, TextField } from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '.';
import { ChangeEvent } from 'react';

export const lineVideoMessageSchema = z.object({
  type: z.literal('video'),
  originalContentUrl: z.string().url(),
  previewImageUrl: z.string().url(),
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

export default LineVideoMessage;

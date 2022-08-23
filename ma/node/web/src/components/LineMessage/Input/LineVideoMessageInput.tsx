import { InputLabel, TextField } from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '../MessageType';
import { ChangeEvent } from 'react';
import LineVideoMessageType from '../MessageType/LineVideoMessageType';

export const DEFAULT_VIDEO_MESSAGE = Object.freeze<LineVideoMessageType>({
  type: 'video',
  originalContentUrl: '',
  previewImageUrl: '',
});

const LineVideoMessageInput: MessageComponent<LineVideoMessageType> = ({
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

export default LineVideoMessageInput;

import { InputLabel, TextField } from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '../MessageType';
import { ChangeEvent } from 'react';
import LineImageMessageType from '../MessageType/LineImageMessageType';

export const DEFAULT_IMAGE_MESSAGE = Object.freeze<LineImageMessageType>({
  type: 'image',
  originalContentUrl: '',
  previewImageUrl: '',
});

const LineImageMessageInput: MessageComponent<LineImageMessageType> = ({
  messageDetails,
  onChange,
  errors,
}) => {
  console.log('image', messageDetails);
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

export default LineImageMessageInput;

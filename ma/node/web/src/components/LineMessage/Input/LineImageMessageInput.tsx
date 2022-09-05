import { InputLabel, TextField } from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '../MessageType';
import { ChangeEvent } from 'react';
import LineImageMessageType from '../MessageType/LineImageMessageType';
import FormArea from '../../FormArea';

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
    <FormArea>
      <InputLabel required className="mb-2">
        画像URL
      </InputLabel>
      <TextField
        placeholder="画像URL"
        value={messageDetails.originalContentUrl}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newMessageDetails = { ...messageDetails };
          newMessageDetails.originalContentUrl = e.target.value;
          onChange && onChange(newMessageDetails);
        }}
        error={errors?.originalContentUrl}
      />
      <div className="mb-4" />
      <InputLabel required className="mb-2">
        プレビュー画像URL
      </InputLabel>
      <TextField
        placeholder="プレビュー画像URL"
        value={messageDetails.previewImageUrl}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newMessageDetails = { ...messageDetails };
          newMessageDetails.previewImageUrl = e.target.value;
          onChange && onChange(newMessageDetails);
        }}
        error={errors?.previewImageUrl}
      />
    </FormArea>
  );
};

export default LineImageMessageInput;

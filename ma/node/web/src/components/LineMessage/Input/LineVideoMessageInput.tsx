import { InputLabel, TextField } from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '../MessageType';
import { ChangeEvent } from 'react';
import LineVideoMessageType from '../MessageType/LineVideoMessageType';
import FormArea from '../../FormArea';

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
    <FormArea>
      <InputLabel required className="mb-2">
        動画URL
      </InputLabel>
      <TextField
        placeholder="動画URL"
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

export default LineVideoMessageInput;

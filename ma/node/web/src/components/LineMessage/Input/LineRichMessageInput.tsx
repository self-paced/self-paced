import { InputLabel, TextField } from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '../MessageType';
import { ChangeEvent } from 'react';
import LineRichMessageType from '../MessageType/LineRichMessageType';

export const DEFAULT_RICH_MESSAGE = Object.freeze<LineRichMessageType>({
  type: 'flex',
  altText: '',
  contents: {
    type: 'bubble',
    size: 'giga',
    hero: {
      type: 'image',
      url: '',
      size: 'full',
      aspectRatio: '1:1',
      aspectMode: 'cover',
      action: {
        type: 'uri',
        uri: '',
      },
    },
  },
});

const LineRichMessageInput: MessageComponent<LineRichMessageType> = ({
  messageDetails,
  onChange,
  errors,
}) => {
  return (
    <div>
      <InputLabel>通知のテキスト</InputLabel>
      <TextField
        value={messageDetails.altText}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newMessageDetails = { ...messageDetails };
          newMessageDetails.altText = e.target.value;
          onChange && onChange(newMessageDetails);
        }}
        error={errors?.altText}
      />
      <InputLabel>画像URL</InputLabel>
      <TextField
        value={messageDetails.contents.hero.url}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newMessageDetails = { ...messageDetails };
          newMessageDetails.contents.hero.url = e.target.value;
          onChange && onChange(newMessageDetails);
        }}
        error={errors?.contents?.hero?.url}
      />
      <InputLabel>アクションリンク</InputLabel>
      <TextField
        value={messageDetails.contents.hero.action.uri}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newMessageDetails = { ...messageDetails };
          newMessageDetails.contents.hero.action.uri = e.target.value;
          onChange && onChange(newMessageDetails);
        }}
        error={errors?.contents?.hero?.action?.uri}
      />
    </div>
  );
};

export default LineRichMessageInput;

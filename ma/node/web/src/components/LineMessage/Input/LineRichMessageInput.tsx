import { InputLabel, TextField } from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '../MessageType';
import { ChangeEvent } from 'react';
import LineRichMessageType from '../MessageType/LineRichMessageType';
import FormArea from '../../FormArea';

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
    <FormArea>
      <InputLabel required className="mb-2">
        通知のテキスト
      </InputLabel>
      <TextField
        placeholder="通知のテキスト"
        value={messageDetails.altText}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newMessageDetails = { ...messageDetails };
          newMessageDetails.altText = e.target.value;
          onChange && onChange(newMessageDetails);
        }}
        error={errors?.altText}
      />
      <div className="mb-4" />
      <InputLabel required className="mb-2">
        画像URL
      </InputLabel>
      <TextField
        placeholder="画像URL"
        value={messageDetails.contents.hero.url}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newMessageDetails = { ...messageDetails };
          newMessageDetails.contents.hero.url = e.target.value;
          onChange && onChange(newMessageDetails);
        }}
        error={errors?.contents?.hero?.url}
      />
      <div className="mb-4" />
      <InputLabel required className="mb-2">
        アクションリンク
      </InputLabel>
      <TextField
        placeholder="アクションリンク"
        value={messageDetails.contents.hero.action.uri}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newMessageDetails = { ...messageDetails };
          newMessageDetails.contents.hero.action.uri = e.target.value;
          onChange && onChange(newMessageDetails);
        }}
        error={errors?.contents?.hero?.action?.uri}
      />
    </FormArea>
  );
};

export default LineRichMessageInput;

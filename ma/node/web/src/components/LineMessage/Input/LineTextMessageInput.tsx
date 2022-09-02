import { TextArea } from '@super_studio/ecforce_ui_albers';
import { ChangeEvent } from 'react';
import { MessageComponent } from '../MessageType';
import LineTextMessageType from '../MessageType/LineTextMessageType';

export const DEFAULT_TEXT_MESSAGE = Object.freeze<LineTextMessageType>({
  type: 'text',
  text: '',
});

const LineTextMessageInput: MessageComponent<LineTextMessageType> = ({
  messageDetails,
  onChange,
  errors,
}) => {
  console.log('text form', messageDetails);
  return (
    <TextArea
      value={messageDetails.text}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        const newMessageDetails = { ...messageDetails };
        newMessageDetails.text = e.target.value;
        onChange && onChange(newMessageDetails);
      }}
      error={errors?.text}
    />
  );
};

export default LineTextMessageInput;

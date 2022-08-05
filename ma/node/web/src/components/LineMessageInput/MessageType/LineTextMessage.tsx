import { TextArea } from '@super_studio/ecforce_ui_albers';
import { ChangeEvent } from 'react';
import { z } from 'zod';
import { MessageComponent } from '.';
import v from '../../../utils/validation';

export const lineTextMessageSchema = z.object({
  type: z.literal('text'),
  text: z.string().min(1, { message: v.MESSAGES.required('メッセージ') }),
});

export type LineTextMessageType = z.infer<typeof lineTextMessageSchema>;

export const DEFAULT_TEXT_MESSAGE = Object.freeze<LineTextMessageType>({
  type: 'text',
  text: '',
});

const LineTextMessage: MessageComponent<LineTextMessageType> = ({
  messageDetails,
  onChange,
  errors,
}) => {
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

export default LineTextMessage;

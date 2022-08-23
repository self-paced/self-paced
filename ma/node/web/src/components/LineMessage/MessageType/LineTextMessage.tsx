import { MessageComponent } from '..';

export type TextType = {
  type: string;
  text: string;
};

export const DEFAULT_TEXT_MESSAGE = Object.freeze<TextType>({
  type: 'text',
  text: '',
});

const LineTextMessage: MessageComponent<TextType> = ({ messageDetails }) => {
  return (
    <div>
      <dl className="grid grid-cols-2">
        <dt>メッセージタイプ</dt>
        <dd>{messageDetails.type}</dd>
        <dt>メッセージ</dt>
        <dd>{messageDetails.text}</dd>
      </dl>
    </div>
  );
};

export default LineTextMessage;

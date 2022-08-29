import { MessageComponent } from '../MessageType';
import LineTextMessageType from '../MessageType/LineTextMessageType';

const LineTextMessageDetail: MessageComponent<LineTextMessageType> = ({
  messageDetails,
}) => {
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

export default LineTextMessageDetail;

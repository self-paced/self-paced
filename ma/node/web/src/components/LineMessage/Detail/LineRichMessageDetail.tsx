/* eslint-disable @next/next/no-img-element */
import { MessageComponent } from '../MessageType';
import LineRichMessageType from '../MessageType/LineRichMessageType';

const LineRichMessageDetail: MessageComponent<LineRichMessageType> = ({
  messageDetails,
}) => {
  return (
    <div>
      <dl className="grid grid-cols-2">
        <dt>メッセージタイプ</dt>
        <dd>{messageDetails.type}</dd>
        <dt>画像URL</dt>
        <dd>
          <div className="w-24 h-24">
            <img
              src={messageDetails.contents.hero.url}
              alt={messageDetails.contents.hero.url}
              className="w-full h-full object-cover"
            />
          </div>
          {messageDetails.contents.hero.url}
        </dd>
        <dt>アクションリンク</dt>
        <dd>{messageDetails.contents.hero.action.uri}</dd>
      </dl>
    </div>
  );
};

export default LineRichMessageDetail;

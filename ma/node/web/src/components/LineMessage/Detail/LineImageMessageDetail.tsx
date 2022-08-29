/* eslint-disable @next/next/no-img-element */
import { MessageComponent } from '../MessageType';
import LineImageMessageType from '../MessageType/LineImageMessageType';

const LineImageMessageDetail: MessageComponent<LineImageMessageType> = ({
  messageDetails,
}) => {
  return (
    <div>
      <dl className="grid grid-cols-2">
        <dt>メッセージタイプ</dt>
        <dd>{messageDetails.type}</dd>
        <dt>画像URL</dt>
        <dd>{messageDetails.originalContentUrl}</dd>
        <dt>プレビュー画像URL</dt>
        <dd>
          <div className="w-24 h-24">
            <img
              src={messageDetails.previewImageUrl}
              alt={messageDetails.previewImageUrl}
              className="w-full h-full object-cover"
            />
          </div>
          {messageDetails.previewImageUrl}
        </dd>
      </dl>
    </div>
  );
};

export default LineImageMessageDetail;

/* eslint-disable @next/next/no-img-element */
import { MessageComponent } from '../MessageType';
import LineVideoMessageType from '../MessageType/LineVideoMessageType';

const LineVideoMessageDetail: MessageComponent<LineVideoMessageType> = ({
  messageDetails,
}) => {
  return (
    <div>
      <dl className="grid grid-cols-2">
        <dt>メッセージタイプ</dt>
        <dd>{messageDetails.type}</dd>
        <dt>動画URL</dt>
        <dd>{messageDetails.originalContentUrl}</dd>
        <dt>プレビュー画像URL</dt>
        <dd>
          <img
            src={messageDetails.previewImageUrl}
            alt={messageDetails.previewImageUrl}
            className="w-full h-full object-cover"
          />
        </dd>
      </dl>
      <h1>{messageDetails.originalContentUrl}</h1>
    </div>
  );
};

export default LineVideoMessageDetail;

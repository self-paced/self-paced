import { MessageComponent } from '../.';

export type Video = {
  type: string;
  originalContentUrl: string;
  previewImageUrl: string;
};

export const DEFAULT_VIDEO_MESSAGE = Object.freeze<Video>({
  type: 'video',
  originalContentUrl: '',
  previewImageUrl: '',
});

const LineMessage: MessageComponent<Video> = ({ messageDetails }) => {
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

export default LineMessage;

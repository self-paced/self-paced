import { MessageComponent } from '../.';
import Image from 'next/image';

export type Image = {
  type: string;
  originalContentUrl: string;
  previewImageUrl: string;
};

export const DEFAULT_IMAGE_MESSAGE = Object.freeze<Image>({
  type: 'image',
  originalContentUrl: '',
  previewImageUrl: '',
});

const LineMessage: MessageComponent<Image> = ({ messageDetails }) => {
  return (
    <div>
      <dl className="grid grid-cols-2">
        <dt>メッセージタイプ</dt>
        <dd>{messageDetails.type}</dd>
        <dt>動画URL</dt>
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

export default LineMessage;

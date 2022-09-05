import { z } from 'zod';
import LineCarouselMessageDetail from '../Detail/LineCarouselMessageDetail';
import LineImageMessageDetail from '../Detail/LineImageMessageDetail';
import LineRichMessageDetail from '../Detail/LineRichMessageDetail';
import LineTextMessageDetail from '../Detail/LineTextMessageDetail';
import LineVideoMessageDetail from '../Detail/LineVideoMessageDetail';
import LineCarouselMessageInput, {
  DEFAULT_CAROUSEL_MESSAGE,
} from '../Input/LineCarouselMessageInput';
import LineImageMessageInput, {
  DEFAULT_IMAGE_MESSAGE,
} from '../Input/LineImageMessageInput';
import LineRichMessageInput, {
  DEFAULT_RICH_MESSAGE,
} from '../Input/LineRichMessageInput';
import LineTextMessageInput, {
  DEFAULT_TEXT_MESSAGE,
} from '../Input/LineTextMessageInput';
import LineVideoMessageInput, {
  DEFAULT_VIDEO_MESSAGE,
} from '../Input/LineVideoMessageInput';
import { lineCarouselMessageSchema } from './LineCarouselMessageType';
import { lineImageMessageSchema } from './LineImageMessageType';
import { lineRichMessageSchema } from './LineRichMessageType';
import { lineTextMessageSchema } from './LineTextMessageType';
import { lineVideoMessageSchema } from './LineVideoMessageType';

export const anyMessageTypeSchema = z.union([
  lineTextMessageSchema,
  lineImageMessageSchema,
  lineVideoMessageSchema,
  lineCarouselMessageSchema,
  lineRichMessageSchema,
]);

export type AnyMessageTypeDetails = z.infer<typeof anyMessageTypeSchema>;

export type MessageComponent<T extends AnyMessageTypeDetails> = React.FC<{
  messageDetails: T;
  onChange?: (v: T) => void | Promise<void>;
  errors?: Partial<T>;
}>;

const MessageType: {
  [key: string]: {
    name: string;
    inputComponent: MessageComponent<any>;
    detailComponent: MessageComponent<any>;
    default: AnyMessageTypeDetails;
  };
} = {
  text: {
    name: 'テキスト',
    inputComponent: LineTextMessageInput,
    detailComponent: LineTextMessageDetail,
    default: DEFAULT_TEXT_MESSAGE,
  },
  image: {
    name: '画像',
    inputComponent: LineImageMessageInput,
    detailComponent: LineImageMessageDetail,
    default: DEFAULT_IMAGE_MESSAGE,
  },
  video: {
    name: '動画',
    inputComponent: LineVideoMessageInput,
    detailComponent: LineVideoMessageDetail,
    default: DEFAULT_VIDEO_MESSAGE,
  },
  flex: {
    name: 'リッチ',
    inputComponent: LineRichMessageInput,
    detailComponent: LineRichMessageDetail,
    default: DEFAULT_RICH_MESSAGE,
  },
  template: {
    name: 'カルーセル',
    inputComponent: LineCarouselMessageInput,
    detailComponent: LineCarouselMessageDetail,
    default: DEFAULT_CAROUSEL_MESSAGE,
  },
};

export default MessageType;

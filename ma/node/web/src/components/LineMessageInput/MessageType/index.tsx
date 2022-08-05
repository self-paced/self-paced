import { z } from 'zod';
import LineCarouselMessage, {
  DEFAULT_CAROUSEL_MESSAGE,
  lineCarouselMessageSchema,
} from './LineCarouselMessage';
import LineImageMessage, {
  DEFAULT_IMAGE_MESSAGE,
  lineImageMessageSchema,
} from './LineImageMessage';
import LineTextMessage, {
  DEFAULT_TEXT_MESSAGE,
  lineTextMessageSchema,
} from './LineTextMessage';
import LineVideoMessage, {
  DEFAULT_VIDEO_MESSAGE,
  lineVideoMessageSchema,
} from './LineVideoMessage';

export const anyMessageTypeSchema = z.union([
  lineTextMessageSchema,
  lineImageMessageSchema,
  lineVideoMessageSchema,
  lineCarouselMessageSchema,
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
    component: MessageComponent<any>;
    default: AnyMessageTypeDetails;
  };
} = {
  text: {
    name: 'テキスト',
    component: LineTextMessage,
    default: DEFAULT_TEXT_MESSAGE,
  },
  image: {
    name: '画像',
    component: LineImageMessage,
    default: DEFAULT_IMAGE_MESSAGE,
  },
  video: {
    name: '動画',
    component: LineVideoMessage,
    default: DEFAULT_VIDEO_MESSAGE,
  },
  template: {
    name: 'カルーセル',
    component: LineCarouselMessage,
    default: DEFAULT_CAROUSEL_MESSAGE,
  },
};

export default MessageType;

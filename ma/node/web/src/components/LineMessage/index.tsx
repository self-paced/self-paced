import LineTextMessage, {
  TextType,
  DEFAULT_TEXT_MESSAGE,
} from './MessageType/LineTextMessage';
import LineCarouselMessage, {
  Carousel,
  DEFAULT_CAROUSEL_MESSAGE,
} from './MessageType/LineCarouselMessage';
import LineImageMessage, {
  Image,
  DEFAULT_IMAGE_MESSAGE,
} from './MessageType/LineImageMessage';
import LineVideoMessage, {
  Video,
  DEFAULT_VIDEO_MESSAGE,
} from './MessageType/LineVideoMessage';

export type AnyMessageTypeDetails = Carousel | TextType | Image | Video;

export type MessageComponent<T extends AnyMessageTypeDetails> = React.FC<{
  messageDetails: T;
}>;

const MessageType: {
  [key: string]: {
    messageDetails: AnyMessageTypeDetails;
    component: MessageComponent<any>;
  };
} = {
  text: {
    component: LineTextMessage,
    messageDetails: DEFAULT_TEXT_MESSAGE,
  },
  template: {
    component: LineCarouselMessage,
    messageDetails: DEFAULT_CAROUSEL_MESSAGE,
  },
  image: {
    component: LineImageMessage,
    messageDetails: DEFAULT_IMAGE_MESSAGE,
  },
  video: {
    component: LineVideoMessage,
    messageDetails: DEFAULT_VIDEO_MESSAGE,
  },
};

export default MessageType;

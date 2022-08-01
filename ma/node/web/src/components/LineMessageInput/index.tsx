import { ChangeEvent, FocusEventHandler, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdAdd,
  MdDelete,
} from 'react-icons/md';
import {
  TextArea,
  Button,
  InputLabel,
  TextField,
  Select,
} from '@super_studio/ecforce_ui_albers';
import { z } from 'zod';

const MAX_MESSAGES = 5;

const lineTextMessageSchema = z.object({
  type: z.literal('text'),
  text: z.string().min(1),
});

const lineImageMessageSchema = z.object({
  type: z.literal('image'),
  originalContentUrl: z.string().url(),
  previewImageUrl: z.string().url(),
});

const lineVideoMessageSchema = z.object({
  type: z.literal('video'),
  originalContentUrl: z.string().url(),
  previewImageUrl: z.string().url(),
});

export const lineMessageInputSchema = z
  .array(
    z.object({
      key: z.number(),
      details: z.union([
        lineTextMessageSchema,
        lineImageMessageSchema,
        lineVideoMessageSchema,
      ]),
    })
  )
  .min(1)
  .max(MAX_MESSAGES);

export type LineMessageInputValue = z.infer<typeof lineMessageInputSchema>;
export type LineTextMessage = z.infer<typeof lineTextMessageSchema>;
export type LineImageMessage = z.infer<typeof lineImageMessageSchema>;
export type LineVideoMessage = z.infer<typeof lineVideoMessageSchema>;

interface LineMessageInputEvent {
  target: {
    name: string;
    value: LineMessageInputValue;
  };
}

export type LineMessageInputEventHandler = (
  e: LineMessageInputEvent
) => boolean | void | Promise<boolean | void>;

const LineMessageInput: React.FC<{
  name: string;
  value?: LineMessageInputValue;
  onChange?: LineMessageInputEventHandler;
  onBlur?: LineMessageInputEventHandler;
}> = ({ name, onChange, onBlur, value }) => {
  const [messages, setMessages] = useState<LineMessageInputValue>(
    value ?? [
      {
        key: 1,
        details: { type: 'text', text: '' },
      },
    ]
  );
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const handleMove = (index: number, shift: 1 | -1) => {
    const newMessages = [...messages];
    newMessages[index] = messages[index + shift];
    newMessages[index + shift] = messages[index];
    setMessages(newMessages);
    onChange &&
      onChange({
        target: {
          name,
          value: newMessages,
        },
      });
  };

  const handleChange = (newMessages: LineMessageInputValue) => {
    setMessages(newMessages);
    onChange &&
      onChange({
        target: {
          name,
          value: newMessages,
        },
      });
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    onBlur &&
      onBlur({
        target: {
          name,
          value: messages,
        },
      });
  };

  return (
    <div ref={parent}>
      {messages.map((message, i) => (
        <div key={message.key}>
          {/* HEADER */}
          <div className="flex gap-1 items-center">
            <div className="font-bold">{`メッセージ #${i + 1}`}</div>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const type = e.target.value;
                const newMessages = [...messages];
                if (type === 'text') {
                  newMessages[i].details = { type, text: '' };
                } else if (type === 'image') {
                  newMessages[i].details = {
                    type,
                    originalContentUrl: '',
                    previewImageUrl: '',
                  };
                } else if (type === 'video') {
                  newMessages[i].details = {
                    type,
                    originalContentUrl: '',
                    previewImageUrl: '',
                  };
                }
                handleChange(newMessages);
              }}
            >
              <option value="text">テキスト</option>
              <option value="image">画像</option>
              <option value="video">動画</option>
            </Select>
            <div className="grow" />
            <Button
              icon
              onClick={() => {
                handleMove(i, 1);
              }}
              disabled={i >= messages.length - 1}
            >
              <MdArrowDropDown />
            </Button>
            <Button
              icon
              onClick={() => {
                handleMove(i, -1);
              }}
              disabled={i === 0}
            >
              <MdArrowDropUp />
            </Button>
            <Button
              icon
              variant="destructive"
              onClick={() => {
                const newMessages = [...messages];
                newMessages.splice(i, 1);
                setMessages(newMessages);
                onChange &&
                  onChange({
                    target: {
                      name,
                      value: newMessages,
                    },
                  });
              }}
              disabled={messages.length === 1}
            >
              <MdDelete />
            </Button>
          </div>
          <div className="my-1">
            {/* TEXT MESSAGE */}
            {message.details.type === 'text' && (
              <TextArea
                value={message.details.text}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newMessages = [...messages];
                  (newMessages[i].details as LineTextMessage).text =
                    e.target.value;
                  handleChange(newMessages);
                }}
                onBlur={handleBlur}
              />
            )}
            {/* IMAGE MESSAGE */}
            {message.details.type === 'image' && (
              <div>
                <InputLabel>画像URL</InputLabel>
                <TextField
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const newMessages = [...messages];
                    (
                      newMessages[i].details as LineImageMessage
                    ).originalContentUrl = e.target.value;
                    handleChange(newMessages);
                  }}
                />
                <InputLabel>プレビュー画像URL</InputLabel>
                <TextField
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const newMessages = [...messages];
                    (
                      newMessages[i].details as LineImageMessage
                    ).previewImageUrl = e.target.value;
                    handleChange(newMessages);
                  }}
                />
              </div>
            )}
            {/* VIDEO MESSAGE */}
            {message.details.type === 'video' && (
              <div>
                <InputLabel>動画URL</InputLabel>
                <TextField
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const newMessages = [...messages];
                    (
                      newMessages[i].details as LineVideoMessage
                    ).originalContentUrl = e.target.value;
                    handleChange(newMessages);
                  }}
                />
                <InputLabel>プレビュー画像URL</InputLabel>
                <TextField
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const newMessages = [...messages];
                    (
                      newMessages[i].details as LineVideoMessage
                    ).previewImageUrl = e.target.value;
                    handleChange(newMessages);
                  }}
                />
              </div>
            )}
          </div>
          {i < messages.length - 1 && <hr className="mb-2" />}
        </div>
      ))}
      {/* ADD MESSAGE BUTTON */}
      <div>
        <Button
          onClick={() => {
            const newMessages: typeof messages = [
              ...messages,
              { key: Date.now(), details: { type: 'text', text: '' } },
            ];
            setMessages(newMessages);
            onChange &&
              onChange({
                target: {
                  name,
                  value: newMessages,
                },
              });
          }}
          disabled={messages.length >= MAX_MESSAGES}
        >
          <MdAdd />
          追加
        </Button>
      </div>
    </div>
  );
};

export default LineMessageInput;

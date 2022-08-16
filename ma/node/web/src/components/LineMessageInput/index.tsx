import { ChangeEvent, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdAdd,
  MdDelete,
} from 'react-icons/md';
import { Button, Select } from '@super_studio/ecforce_ui_albers';
import { z } from 'zod';
import MessageType, {
  AnyMessageTypeDetails,
  anyMessageTypeSchema,
} from './MessageType';
import { EcfSchema } from '../../pages/line-message';

const MAX_MESSAGES = 5;

export const lineMessageInputSchema = z
  .array(
    z.object({
      key: z.number(),
      details: anyMessageTypeSchema,
    })
  )
  .min(1)
  .max(MAX_MESSAGES);

export const messageTitleInputSchema = z.string().min(1);

export type LineMessageInputValue = z.infer<typeof lineMessageInputSchema>;
export type MessageEventTitleInputValue = z.infer<
  typeof messageTitleInputSchema
>;

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
  errors: Partial<EcfSchema>;
  onChange?: LineMessageInputEventHandler;
}> = ({ name, onChange, value, errors }) => {
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

  return (
    <div ref={parent}>
      {messages.map((message, i) => {
        const MessageComponent = MessageType[message.details.type].component;
        return (
          <div
            key={message.key}
            className="border-l-4 border-b-4 border-gray-200 pl-4 mb-2"
          >
            {/* HEADER */}
            <div className="flex gap-1 items-center">
              <div className="font-bold">{`メッセージ #${i + 1}`}</div>
              <Select
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const type = e.target.value as keyof typeof MessageType;
                  const newMessages = [...messages];
                  newMessages[i].details = JSON.parse(
                    JSON.stringify(MessageType[type].default)
                  ); // deep copy
                  handleChange(newMessages);
                }}
              >
                {Object.entries(MessageType).map(([type, details]) => (
                  <option key={type} value={type}>
                    {details.name}
                  </option>
                ))}
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
            {/* CUSTOM MESSAGE INPUT */}
            <div className="my-1">
              <MessageComponent
                messageDetails={message.details as any}
                onChange={(v) => {
                  const newMessages = [...messages];
                  newMessages[i].details = v;
                  handleChange(newMessages);
                }}
                errors={
                  errors.messages
                    ? (errors.messages[i]
                        ?.details as Partial<AnyMessageTypeDetails>)
                    : undefined
                }
              />
            </div>
          </div>
        );
      })}
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
          メッセージ追加
        </Button>
      </div>
    </div>
  );
};

export default LineMessageInput;

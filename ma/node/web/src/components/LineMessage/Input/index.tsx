import { ChangeEvent, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  Button,
  Select,
  Card,
  CardHead,
  CardBody,
  InputLabel,
  AddIcon,
  ArrowDownwardIcon,
  ArrowUpwardIcon,
  ClearIcon,
} from '@super_studio/ecforce_ui_albers';
import { z } from 'zod';
import MessageType, {
  AnyMessageTypeDetails,
  anyMessageTypeSchema,
} from '../MessageType';
import { EcfSchema } from '../../../pages/messages/new';
import FormArea from '../../FormArea';
import IconButton from '../../IconButton';
import { useDialog } from '../../AppUtilityProvider/DialogProvider';

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

export type LineMessageInputValue = z.infer<typeof lineMessageInputSchema>;

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
  const showDialog = useDialog();
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
        console.log('component', message);
        const MessageComponent =
          MessageType[message.details.type].inputComponent;
        return (
          <div key={message.key}>
            <Card>
              <CardHead>
                <div className="flex gap-1 items-center">
                  {`メッセージ ${i + 1}`}
                  <div className="grow" />
                  <IconButton
                    onClick={() => {
                      handleMove(i, 1);
                    }}
                    disabled={i >= messages.length - 1}
                  >
                    <ArrowDownwardIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      handleMove(i, -1);
                    }}
                    disabled={i === 0}
                  >
                    <ArrowUpwardIcon />
                  </IconButton>
                  <IconButton
                    onClick={async () => {
                      if (
                        await showDialog({
                          title: 'メッセージ削除',
                          message: `メッセージ${i + 1}を削除しますか？`,
                          variant: 'destructive',
                          confirmText: '削除',
                        })
                      ) {
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
                      }
                    }}
                    disabled={messages.length === 1}
                  >
                    <ClearIcon />
                  </IconButton>
                </div>
              </CardHead>
              <CardBody>
                <FormArea>
                  <InputLabel required className="mb-2">
                    タイプ
                  </InputLabel>
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
                  <div className="mb-4" />
                </FormArea>
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
              </CardBody>
            </Card>
            <div className="mb-6" />
          </div>
        );
      })}
      {/* ADD MESSAGE BUTTON */}
      <div>
        <Button
          icon={<AddIcon height={16} width={16} />}
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
          メッセージ追加
        </Button>
      </div>
    </div>
  );
};

export default LineMessageInput;

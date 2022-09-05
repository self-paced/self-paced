import { zodResolver } from '@hookform/resolvers/zod';
import type { NextPage } from 'next';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '../../../utils/trpc';
import {
  Card,
  CardHead,
  CardBody,
  Radio,
  Checkbox,
  Button,
  Select,
  InputLabel,
  TextField,
  FloatArea,
} from '@super_studio/ecforce_ui_albers';
import {
  ChangeEvent,
  ChangeEventHandler,
  useState,
  useEffect,
  CompositionEvent,
} from 'react';
import LineMessageInput, {
  LineMessageInputEventHandler,
  lineMessageInputSchema,
  LineMessageInputValue,
} from '../../../components/LineMessage/Input';
import v from '../../../utils/validation';
import { useDialog } from '../../../components/AppUtilityProvider/DialogProvider';
import Router, { useRouter } from 'next/router';
import MessageType, {
  AnyMessageTypeDetails,
} from '../../../components/LineMessage/MessageType';
import message from '../../../../../sls/src/functions/trpc/routers/message';

// TODO: 年齢の対応の時、以下は使われます。
// type AgeVal =
//   | 'age_15'
//   | 'age_20'
//   | 'age_25'
//   | 'age_30'
//   | 'age_35'
//   | 'age_40'
//   | 'age_45'
//   | 'age_50';

// enum AgeEnum {
//   '0_14',
//   '15_19',
//   '20_24',
//   '25_29',
//   '30_999',
// }

// const ageMap: {
//   [key in keyof typeof AgeEnum]: {
//     gte?: AgeVal;
//     lt?: AgeVal;
//   };
// } = {
//   '0_14': { lt: 'age_15' },
//   '15_19': { gte: 'age_15', lt: 'age_20' },
//   '20_24': { gte: 'age_20', lt: 'age_25' },
//   '25_29': { gte: 'age_25', lt: 'age_30' },
//   '30_999': { gte: 'age_30' },
// } as const;

const lineSchema = z.object({
  title: z.string().min(1, { message: v.MESSAGES.required('タイトル') }),

  messages: lineMessageInputSchema,
  gender: z.array(z.enum(['male', 'female'])),
  // age: z.nativeEnum(AgeEnum).nullish(), // TODO: 年齢の対応
});

const ecfSchema = z.object({
  title: z.string().min(1, { message: v.MESSAGES.required('タイトル') }),
  segmentTitle: z.string().min(1),
  messages: lineMessageInputSchema,
  segmentToken: z
    .string()
    .min(1, { message: v.MESSAGES.required('配信対象検索条件') }),
});

export type EcfSchema = z.infer<typeof ecfSchema>;
export type LineSchema = z.infer<typeof lineSchema>;

const TypeSelector: React.FC<{
  type: 'ecf' | 'line';
  onChange: ChangeEventHandler<HTMLInputElement>;
}> = ({ type, onChange }) => {
  return (
    <>
      <Radio
        value="ecf"
        id="ecf"
        name="ecf"
        checked={type === 'ecf'}
        onChange={onChange}
      >
        ecforce顧客
      </Radio>
      <div className="inline mr-8"></div>
      <Radio
        value="line"
        id="line"
        name="line"
        checked={type === 'line'}
        onChange={onChange}
      >
        Line友達（ecforce未連携）
      </Radio>
    </>
  );
};

const EcfForm: React.FC<{
  title: string;
  segmentId: string;
  segmentTitle: string;
  type: 'ecf' | 'line';
  defaultMessages: LineMessageInputValue;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onTypeChange: ChangeEventHandler<HTMLInputElement>;
  onSegmentChange: ChangeEventHandler<HTMLSelectElement>;
  onMessageChange: LineMessageInputEventHandler;
  onError: (message: string) => void;
  onValidationError: (error: z.ZodIssue[]) => void;
  segments: { token: string; name: string }[];
  load: boolean;
}> = ({
  title,
  segmentId,
  segmentTitle,
  type,
  defaultMessages,
  onTitleChange,
  onTypeChange,
  onSegmentChange,
  onMessageChange,
  onError,
  onValidationError,
  segments,
  load,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EcfSchema>({
    resolver: zodResolver(ecfSchema),
    defaultValues: {
      title: title,
      segmentTitle: segmentTitle,
      messages: defaultMessages,
    },
  });

  const showDialog = useDialog();
  const [testIdList, setTestIdList] = useState('');

  const segmentToken = watch('segmentToken');
  const messages = watch('messages');

  const multicast = trpc.useMutation('line.multicast');
  const scheduleUpdate = trpc.useMutation('schedule.update');
  const updateDraft = trpc.useMutation('schedule.updateDraft');

  useEffect(() => {
    if (load) {
      console.log(defaultMessages);
      setValue('title', title);
      setValue('messages', defaultMessages);

      reset;
    }
  }, [load, defaultMessages, setValue, reset, title]);

  const sendTestMessage = async () => {
    try {
      const data = getValues();
      lineMessageInputSchema.parse(data.messages);
      await multicast.mutate(
        {
          title: data.title,
          messages: data.messages.map((message) => message.details),
          userIds: testIdList.split(','),
        },
        {
          onError: () => {
            onError('エラーが発生しました。');
          },
          onSuccess: () => {
            showDialog({
              title: 'テストメッセージ配信完了。',
              noCancelButton: true,
            });
          },
        }
      );
    } catch (e) {
      if (e instanceof z.ZodError) {
        onValidationError(e.issues);
      } else {
        onError('エラーが発生しました。');
      }
    }
  };

  const handleValid: SubmitHandler<EcfSchema> = async (data) => {
    await scheduleUpdate.mutate(
      {
        id: Router.query.id as string,
        title: title,
        segmentTitle: segmentTitle,
        token: segmentToken,
        messages: data.messages.map((message) => message.details),
        status: 'waiting',
      },
      {
        onError: () => {
          onError('エラーが発生しました。');
        },
        onSuccess: async () => {
          await Router.push('/messages');
        },
      }
    );
  };

  const handleDraft: SubmitHandler<EcfSchema> = async (data) => {
    await updateDraft.mutate(
      {
        id: Router.query.id as string,
        title: title,
        segmentTitle: segmentTitle,
        token: segmentToken,
        messages: messages.map((message) => message.details),
        status: 'draft',
      },
      {
        onError: () => {
          onError('エラーが発生しました。');
        },
        onSuccess: async () => {
          await Router.push('/messages');
        },
      }
    );
  };

  const handleInvalid: SubmitErrorHandler<EcfSchema> = (errors) => {
    console.log(errors);
    try {
      ecfSchema.parse(getValues());
    } catch (e) {
      if (e instanceof z.ZodError) {
        console.error(getValues());
        console.error(ecfSchema.parse(getValues()));
        console.error(e.issues);
        onValidationError(e.issues);
      } else {
        onError('エラーが発生しました。');
      }
    }
  };

  if (!load) {
    return <div>loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(handleValid, handleInvalid)}>
      <Card>
        <CardHead>配信対象</CardHead>
        <CardBody>
          <div>
            <InputLabel>配信対象検索条件</InputLabel>
            <Select
              {...register('segmentToken')}
              error={!!errors.segmentToken}
              onChange={onSegmentChange}
              value={segmentId}
            >
              <option value="">選択してください</option>
              {segments.map((segment) => (
                <option key={segment.token} value={segment.token}>
                  {segment.name}
                </option>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>
      <div className="mt-6" />
      <Card>
        <CardHead>配信内容</CardHead>
        <CardBody>
          <div className="mb-4">
            <InputLabel>配信タイトル</InputLabel>
            <div className="flex item-center gap2">
              <div className="grow">
                <Controller
                  control={control}
                  name="title"
                  render={({ field: { name, onChange } }) => (
                    <TextField
                      name={name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChange(e);
                        onTitleChange(e);
                      }}
                      value={title}
                      error={!!errors.title}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <Controller
            control={control}
            name="messages"
            render={({ field: { name, onChange } }) => (
              <LineMessageInput
                name={name}
                onChange={(e) => {
                  onChange(e);
                  onMessageChange(e);
                }}
                value={defaultMessages}
                errors={errors as Partial<EcfSchema>}
              />
            )}
          />
          <div className="my-2">
            <InputLabel>テスト配信</InputLabel>
            <div className="flex items-center gap-2">
              <div className="grow">
                <TextField
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setTestIdList(e.target.value);
                  }}
                />
              </div>
              <Button variant="secondary" onClick={sendTestMessage}>
                テスト送信
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="mt-6" />
      <FloatArea
        basicButton={<Button onClick={handleDraft}>下書き保存</Button>}
        secondaryButton={
          <Button type="submit" variant="secondary" disabled={isSubmitting}>
            送信
          </Button>
        }
      />
    </form>
  );
};

const LineForm: React.FC<{
  title: string;
  type: 'ecf' | 'line';
  defaultMessages: LineMessageInputValue;
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onTypeChange: ChangeEventHandler<HTMLInputElement>;
  onMessageChange: LineMessageInputEventHandler;
  onError: (message: string) => void;
  onValidationError: (error: z.ZodIssue[]) => void;
}> = ({
  title,
  type,
  defaultMessages,
  onTitleChange,
  onTypeChange,
  onMessageChange,
  onError,
  onValidationError,
}) => {
  const showDialog = useDialog();
  const [testIdList, setTestIdList] = useState('');
  const narrowcast = trpc.useMutation('line.narrowcast');
  const multicast = trpc.useMutation('line.multicast');
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LineSchema>({
    resolver: zodResolver(lineSchema),
    defaultValues: {
      messages: defaultMessages,
      gender: [],
    },
  });

  const sendTestMessage = async () => {
    try {
      const data = getValues();
      lineMessageInputSchema.parse(data.messages);
      await multicast.mutate(
        {
          title: data.title,
          messages: data.messages.map((message) => message.details),
          userIds: testIdList.split(','),
        },
        {
          onError: () => {
            onError('エラーが発生しました。');
          },
          onSuccess: () => {
            showDialog({
              title: 'テストメッセージ配信完了。',
              noCancelButton: true,
            });
          },
        }
      );
    } catch (e) {
      if (e instanceof z.ZodError) {
        onValidationError(e.issues);
      } else {
        onError('エラーが発生しました。');
      }
    }
  };

  const handleValid: SubmitHandler<LineSchema> = async (data) => {
    await narrowcast.mutate(
      {
        title: data.title,
        messages: data.messages.map((message) => message.details),
        gender: data.gender.length === 1 ? data.gender[0] : undefined,
      },
      {
        onError: () => {
          onError('エラーが発生しました。');
        },
        onSuccess: async () => {
          await Router.replace('/send-complete');
        },
      }
    );
  };

  const handleInvalid: SubmitErrorHandler<EcfSchema> = () => {
    try {
      lineSchema.parse(getValues());
    } catch (e) {
      if (e instanceof z.ZodError) {
        onValidationError(e.issues);
      } else {
        onError('エラーが発生しました。');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleValid, handleInvalid)}>
      <Card>
        <CardHead>配信対象</CardHead>
        <CardBody>
          <div>
            <InputLabel>性別</InputLabel>
            <div className="text-xs">
              <Checkbox {...register('gender')} value="male" id="male">
                男性
              </Checkbox>
              <div className="inline mr-8"></div>
              <Checkbox {...register('gender')} value="female" id="female">
                女性
              </Checkbox>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="mt-6" />
      <Card>
        <CardHead>配信内容</CardHead>
        <CardBody>
          <div className="mb-4">
            <InputLabel>配信タイトル</InputLabel>
            <div className="flex item-center gap2">
              <div className="grow">
                <Controller
                  control={control}
                  name="title"
                  render={({ field: { name, onChange } }) => (
                    <TextField
                      name={name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChange(e);
                        onTitleChange(e);
                      }}
                      value={title}
                      error={!!errors.title}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <Controller
            control={control}
            name="messages"
            render={({ field: { name, onChange } }) => (
              <LineMessageInput
                name={name}
                onChange={(e) => {
                  onChange(e);
                  onMessageChange(e);
                }}
                value={defaultMessages}
                errors={errors as Partial<LineSchema>}
              />
            )}
          />
          <div className="my-2">
            <InputLabel>テスト配信</InputLabel>
            <div className="flex items-center gap-2">
              <div className="grow">
                <TextField
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setTestIdList(e.target.value);
                  }}
                />
              </div>
              <Button variant="secondary" onClick={sendTestMessage}>
                テスト送信
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="mt-6" />
      <FloatArea
        secondaryButton={
          <Button type="submit" variant="secondary" disabled={isSubmitting}>
            送信
          </Button>
        }
      />
    </form>
  );
};

const Page: NextPage = () => {
  const router = useRouter();
  const showDialog = useDialog();
  const [type, setType] = useState('ecf');
  const [title, setTitle] = useState('');
  const [segmentId, setSegmentId] = useState('');
  const [segmentTitle, setSegmentTitle] = useState('');
  const [load, setLoad] = useState(false);
  const [messages, setMessages] = useState<LineMessageInputValue>([
    {
      key: 1,
      details: {
        type: 'text',
        text: '',
      },
    },
  ]);

  const segments = trpc.useQuery(['segment.list']);
  const messageSchedule = trpc.useQuery([
    'schedule.event',
    {
      id: router.query.id as string,
    },
  ]);

  useEffect(() => {
    if (messageSchedule.data && segments.data) {
      setTitle(messageSchedule.data.title);
      setSegmentId(messageSchedule.data.segmentId as string);
      setSegmentTitle(messageSchedule.data.segmentTitle as string);
      const messages = JSON.parse(messageSchedule.data.content as string).map(
        (message: AnyMessageTypeDetails) => {
          return {
            // id: i,
            details: message,
          };
        }
      );
      setMessages(messages);
      setLoad(true);
    }
  }, [messageSchedule.data, segments.data]);

  if (!segments.data) {
    return <div>Loading...</div>;
  }

  if (messageSchedule.error) {
    return <div>Error: {messageSchedule.error?.message}</div>;
  }

  if (!messageSchedule.data) {
    return <div>Loading...</div>;
  }

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log('title', title);
    setTitle(e.target.value);
  };
  const handleTypeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setType(e.target.value);
  };
  const handleMessageChange: LineMessageInputEventHandler = (e) => {
    setMessages(e.target.value);
  };
  const handleSegmentChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSegmentId(e.target.selectedOptions[0].value);
    setSegmentTitle(e.target.selectedOptions[0].text);
    console.log('segment title', segmentTitle);
  };

  const handleError = () => {
    showDialog({
      title: '送信エラー',
      message: 'エラーが発生しました。',
      noCancelButton: true,
    });
  };
  const handleValidationError = (e: z.ZodIssue[]) => {
    const displayedErrorFields: (string | number)[] = [];
    // 各フィールドの1つ目のエラーを表示する
    showDialog({
      title: 'バリデーションエラー',
      message: e
        .filter((issue) => {
          if (displayedErrorFields.includes(issue.path.join('.'))) {
            return false;
          }
          displayedErrorFields.push(issue.path.join('.'));
          return true;
        })
        .map((issue) => {
          return '・' + issue.message;
        })
        .join('\n'),
      noCancelButton: true,
    });
  };

  return (
    <div>
      {type === 'ecf' && (
        <EcfForm
          title={title}
          segmentId={segmentId}
          segmentTitle={segmentTitle}
          type={type}
          defaultMessages={messages}
          onTitleChange={handleTitleChange}
          onTypeChange={handleTypeChange}
          onMessageChange={handleMessageChange}
          onSegmentChange={handleSegmentChange}
          onError={handleError}
          onValidationError={handleValidationError}
          segments={segments.data}
          load={load}
        />
      )}
      {type === 'line' && (
        <LineForm
          title={title}
          type={type}
          defaultMessages={messages}
          onTitleChange={handleTitleChange}
          onTypeChange={handleTypeChange}
          onMessageChange={handleMessageChange}
          onError={handleError}
          onValidationError={handleValidationError}
        />
      )}
    </div>
  );
};

export default Page;

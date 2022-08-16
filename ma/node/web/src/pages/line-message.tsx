import { zodResolver } from '@hookform/resolvers/zod';
import type { NextPage } from 'next';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '../utils/trpc';
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
} from '@super_studio/ecforce_ui_albers';
import { ChangeEvent, ChangeEventHandler, useState } from 'react';
import LineMessageInput, {
  LineMessageInputEventHandler,
  lineMessageInputSchema,
  LineMessageInputValue,
} from '../components/LineMessageInput';
import v from '../utils/validation';
import { useDialog } from '../components/AppUtilityProvider/DialogProvider';
import Router from 'next/router';

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
  messages: lineMessageInputSchema,
  gender: z.array(z.enum(['male', 'female'])),
  // age: z.nativeEnum(AgeEnum).nullish(), // TODO: 年齢の対応
});

const ecfSchema = z.object({
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
  type: 'ecf' | 'line';
  defaultMessages: LineMessageInputValue;
  onTypeChange: ChangeEventHandler<HTMLInputElement>;
  onMessageChange: LineMessageInputEventHandler;
  onError: (message: string) => void;
  onValidationError: (error: z.ZodIssue[]) => void;
  segments: { token: string; name: string }[];
}> = ({
  type,
  defaultMessages,
  onTypeChange,
  onMessageChange,
  onError,
  onValidationError,
  segments,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<EcfSchema>({
    resolver: zodResolver(ecfSchema),
    defaultValues: {
      messages: defaultMessages,
    },
  });
  const showDialog = useDialog();
  const [testIdList, setTestIdList] = useState('');
  const segmentToken = watch('segmentToken');

  const publisher = trpc.useMutation('publisher.push');
  const multicast = trpc.useMutation('line.multicast');

  const sendTestMessage = async () => {
    try {
      const data = getValues();
      lineMessageInputSchema.parse(data.messages);
      await multicast.mutate(
        {
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
    await publisher.mutate(
      {
        token: segmentToken,
        messages: data.messages.map((message) => message.details),
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

  const handleInvalid: SubmitErrorHandler<EcfSchema> = (errors) => {
    try {
      ecfSchema.parse(getValues());
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
          <InputLabel>配信対象</InputLabel>
          <div>
            <TypeSelector type={type} onChange={onTypeChange} />
          </div>
          <div className="mt-3">
            <InputLabel>配信対象検索条件</InputLabel>
            <Select {...register('segmentToken')} error={!!errors.segmentToken}>
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
      <Card>
        <CardBody>
          <div className="text-right bg-[#F7F9FA] p-4 rounded-md">
            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              送信
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

const LineForm: React.FC<{
  type: 'ecf' | 'line';
  defaultMessages: LineMessageInputValue;
  onTypeChange: ChangeEventHandler<HTMLInputElement>;
  onMessageChange: LineMessageInputEventHandler;
  onError: (message: string) => void;
  onValidationError: (error: z.ZodIssue[]) => void;
}> = ({
  type,
  defaultMessages,
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
          <InputLabel>配信対象</InputLabel>
          <div>
            <TypeSelector type={type} onChange={onTypeChange} />
          </div>
          <div className="mt-3">
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
      <Card>
        <div className="text-right bg-[#F7F9FA] p-4 rounded-md">
          <Button type="submit" variant="secondary" disabled={isSubmitting}>
            送信
          </Button>
        </div>
      </Card>
    </form>
  );
};

const Page: NextPage = () => {
  const showDialog = useDialog();
  const [type, setType] = useState('ecf');
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

  if (!segments.data) {
    return <div>Loading...</div>;
  }

  const handleTypeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setType(e.target.value);
  };
  const handleMessageChange: LineMessageInputEventHandler = (e) => {
    setMessages(e.target.value);
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
          type={type}
          defaultMessages={messages}
          onTypeChange={handleTypeChange}
          onMessageChange={handleMessageChange}
          onError={handleError}
          onValidationError={handleValidationError}
          segments={segments.data}
        />
      )}
      {type === 'line' && (
        <LineForm
          type={type}
          defaultMessages={messages}
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

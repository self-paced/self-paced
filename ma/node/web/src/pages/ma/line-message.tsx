import { zodResolver } from '@hookform/resolvers/zod';
import type { NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '../../utils/trpc';
import {
  Card,
  Radio,
  Checkbox,
  Button,
  Select,
  TextArea,
  InputLabel,
} from '@super_studio/ecforce_ui_albers';
import { ChangeEventHandler, useState } from 'react';

const MESSAGES_SCHEMA = z.array(z.string().min(1)).min(1).max(5);

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
  messages: MESSAGES_SCHEMA,
  gender: z.array(z.enum(['male', 'female'])),
  // age: z.nativeEnum(AgeEnum).nullish(), // TODO: 年齢の対応
});

const ecfSchema = z.object({
  messages: MESSAGES_SCHEMA,
  segmentId: z.string().min(1),
});

type EcfSchema = z.infer<typeof ecfSchema>;
type LineSchema = z.infer<typeof lineSchema>;

const DUMMY_DATA = {
  segments: [
    {
      id: '1',
      name: 'segment 1',
      user_counts: 832,
      line_counts: 153,
    },
    {
      id: '2',
      name: 'segment 2',
      user_counts: 13,
      line_counts: 3,
    },
    {
      id: '3',
      name: 'segment 3',
      user_counts: 1109,
      line_counts: 540,
    },
  ],
};

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
  defaultMessage: string;
  onTypeChange: ChangeEventHandler<HTMLInputElement>;
  onMessageChange: ChangeEventHandler<HTMLInputElement>;
}> = ({ type, defaultMessage, onTypeChange, onMessageChange }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EcfSchema>({
    resolver: zodResolver(ecfSchema),
    defaultValues: {
      messages: [defaultMessage],
    },
  });
  const segmentId = watch('segmentId');

  const onSubmit: SubmitHandler<EcfSchema> = async (data) => {
    console.log('SUBMIT');
    console.log(data);
    // TODO: API連携
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card header="配信対象">
        <InputLabel>配信対象</InputLabel>
        <div>
          <TypeSelector type={type} onChange={onTypeChange} />
        </div>
        <div className="mt-3">
          <InputLabel>配信対象検索条件</InputLabel>
          <Select {...register('segmentId')}>
            <option value="">選択してください</option>
            {DUMMY_DATA.segments.map((segment) => (
              <option key={segment.id} value={segment.id}>
                {segment.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="mt-3">
          <InputLabel>配信人数カウント</InputLabel>
          <div className="text-xs">
            {segmentId
              ? DUMMY_DATA.segments.find((segment) => segment.id === segmentId)
                  ?.user_counts + '人'
              : '-'}
          </div>
        </div>
      </Card>
      <div className="mt-6" />
      <Card header="配信内容">
        <TextArea {...register('messages.0')} onChange={onMessageChange} />
      </Card>
      <div className="mt-6" />
      <Card>
        <div className="text-right bg-[#F7F9FA] p-4 rounded-md">
          <Button type="submit" variant="secondary" label="送信" />
        </div>
      </Card>
    </form>
  );
};

const LineForm: React.FC<{
  type: 'ecf' | 'line';
  defaultMessage: string;
  onTypeChange: ChangeEventHandler<HTMLInputElement>;
  onMessageChange: ChangeEventHandler<HTMLInputElement>;
}> = ({ type, defaultMessage, onTypeChange, onMessageChange }) => {
  const narrowcast = trpc.useMutation('line.narrowcast');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LineSchema>({
    resolver: zodResolver(lineSchema),
    defaultValues: {
      messages: [defaultMessage],
      gender: [],
    },
  });

  const onSubmit: SubmitHandler<LineSchema> = async (data) => {
    await narrowcast.mutate({
      messages: data.messages,
      gender: data.gender.length === 1 ? data.gender[0] : undefined,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card header="配信対象">
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
      </Card>
      <div className="mt-6" />
      <Card header="配信内容">
        <TextArea {...register('messages.0')} onChange={onMessageChange} />
      </Card>
      <div className="mt-6" />
      <Card>
        <div className="text-right bg-[#F7F9FA] p-4 rounded-md">
          <Button type="submit" variant="secondary" label="送信" />
        </div>
      </Card>
    </form>
  );
};

const Home: NextPage = () => {
  const [type, setType] = useState('ecf');
  const [message, setMessage] = useState('');
  const handleTypeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setType(e.target.value);
  };
  const handleMessageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div>
      {type === 'ecf' && (
        <EcfForm
          type={type}
          defaultMessage={message}
          onTypeChange={handleTypeChange}
          onMessageChange={handleMessageChange}
        />
      )}
      {type === 'line' && (
        <LineForm
          type={type}
          defaultMessage={message}
          onTypeChange={handleTypeChange}
          onMessageChange={handleMessageChange}
        />
      )}
    </div>
  );
};

export default Home;

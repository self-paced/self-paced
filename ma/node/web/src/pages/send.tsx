import { zodResolver } from '@hookform/resolvers/zod';
import type { NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomButton from '../components/CustomButton';
import { trpc } from '../utils/trpc';

const MESSAGES_SCHEMA = z.array(z.string()).min(1).max(5);
const AGE_SCHEMA = z.union([
  z.literal('age_15'),
  z.literal('age_20'),
  z.literal('age_25'),
  z.literal('age_30'),
  z.literal('age_35'),
  z.literal('age_40'),
  z.literal('age_45'),
  z.literal('age_50'),
]);

const schema = z.object({
  messages: MESSAGES_SCHEMA,
  type: z.union([
    z.literal('broadcast'),
    z.literal('multicast'),
    z.literal('narrowcast'),
  ]),
  targets: z.object({
    ravi: z.boolean(),
    murakami: z.boolean(),
    kawabata: z.boolean(),
    kikuchi: z.boolean(),
  }),
  gender: z.union([z.literal('male'), z.literal('female')]).nullish(),
  age: z.object({ gte: AGE_SCHEMA.nullish(), lt: AGE_SCHEMA.nullish() }),
});

type Schema = z.infer<typeof schema>;

const USER_MAP: { [key: string]: string } = {
  ravi: 'Uabe224d99d896c04a0fc5730a8c58cb4',
  murakami: 'U047bb714204750b1fac84038db302a12',
  kawabata: 'U54e5269306edf7d6a33fe44099a02fe2',
  kikuchi: 'U97e07eaecdc08925a9bec89f31216e08',
};

const Home: NextPage = () => {
  const multicast = trpc.useMutation('line.multicast');
  const broadcast = trpc.useMutation('line.broadcast');
  const narrowcast = trpc.useMutation('line.narrowcast');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      messages: [''],
      type: 'multicast',
      targets: {
        ravi: false,
        kawabata: false,
        kikuchi: false,
        murakami: false,
      },
    },
  });

  const type = watch('type');

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    switch (data.type) {
      // 選択された友達に送信
      case 'multicast':
        const userIds: string[] = [];
        Object.entries(data.targets).forEach(([name, isSelected]) => {
          if (isSelected) userIds.push(USER_MAP[name]);
        });
        await multicast.mutate({ messages: data.messages, userIds });
        break;
      // すべての友達に送信
      case 'broadcast':
        await broadcast.mutate({ messages: data.messages });
        break;
      // 条件付きで送信
      case 'narrowcast':
        await narrowcast.mutate({
          messages: data.messages,
          age: data.age,
          gender: data.gender,
        });
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <textarea {...register('messages.0')} />
      </div>
      <div>
        <label htmlFor="broadcast">
          <input
            {...register('type')}
            type="radio"
            value="broadcast"
            id="broadcast"
          />
          Broadcast
        </label>
      </div>
      <div>
        <label htmlFor="multicast">
          <input
            {...register('type')}
            type="radio"
            value="multicast"
            id="multicast"
          />
          Multicast
        </label>
      </div>
      <div>
        <label htmlFor="narrowcast">
          <input
            {...register('type')}
            type="radio"
            value="narrowcast"
            id="narrowcast"
          />
          Narrowcast
        </label>
      </div>
      {type === 'multicast' && (
        <div>
          {Object.entries(USER_MAP).map(([name]) => (
            <div key={name}>
              <label htmlFor={name}>
                <input
                  {...register(`targets.${name}` as any)}
                  type="checkbox"
                  id={name}
                />
                {name}
              </label>
            </div>
          ))}
        </div>
      )}
      {type === 'narrowcast' && (
        <div className="flex">
          <div className="border border-black m-2 p-2">
            <div>gte</div>
            {AGE_SCHEMA.options.map((opt) => {
              const optStr = opt._def.value;
              return (
                <div key={optStr}>
                  <label htmlFor={`gte-${optStr}`}>
                    <input
                      {...register(`age.gte`)}
                      type="radio"
                      value={optStr}
                      id={`gte-${optStr}`}
                    />
                    {optStr}
                  </label>
                </div>
              );
            })}
          </div>
          <div className="border border-black m-2 p-2">
            <div>lt</div>
            {AGE_SCHEMA.options.map((opt) => {
              const optStr = opt._def.value;
              return (
                <div key={optStr}>
                  <label htmlFor={`lt-${optStr}`}>
                    <input
                      {...register(`age.lt`)}
                      type="radio"
                      value={optStr}
                      id={`lt-${optStr}`}
                    />
                    {optStr}
                  </label>
                </div>
              );
            })}
          </div>
          <div className="border border-black m-2 p-2">
            <div>gender</div>
            {['male', 'female'].map((optStr) => {
              return (
                <div key={optStr}>
                  <label htmlFor={optStr}>
                    <input
                      {...register(`gender`)}
                      type="radio"
                      value={optStr}
                      id={optStr}
                    />
                    {optStr}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div>
        <CustomButton type="submit">送信</CustomButton>
      </div>
    </form>
  );
};

export default Home;

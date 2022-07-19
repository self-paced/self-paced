import { zodResolver } from '@hookform/resolvers/zod';
import type { NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomButton from '../components/CustomButton';
import { trpc } from '../utils/trpc';

const schema = z.object({
  messages: z.array(z.string().min(1)),
  type: z.union([z.literal('broadcast'), z.literal('target')]),
  targets: z.object({
    ravi: z.boolean(),
    murakami: z.boolean(),
    kawabata: z.boolean(),
    kikuchi: z.boolean(),
  }),
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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      messages: [''],
      type: 'target',
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
      case 'target':
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
        <label htmlFor="target">
          <input
            {...register('type')}
            type="radio"
            value="target"
            id="target"
          />
          Target
        </label>
      </div>
      {type === 'target' && (
        <div>
          <div>
            <label htmlFor="ravi">
              <input {...register('targets.ravi')} type="checkbox" id="ravi" />
              ハヴィー
            </label>
          </div>
          <div>
            <label htmlFor="murakami">
              <input
                {...register('targets.murakami')}
                type="checkbox"
                id="murakami"
              />
              村上
            </label>
          </div>
          <div>
            <label htmlFor="kawabata">
              <input
                {...register('targets.kawabata')}
                type="checkbox"
                id="kawabata"
              />
              河端
            </label>
          </div>
          <div>
            <label htmlFor="kikuchi">
              <input
                {...register('targets.kikuchi')}
                type="checkbox"
                id="kikuchi"
              />
              菊池
            </label>
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

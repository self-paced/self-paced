import type { NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  example: z.string(),
  exampleRequired: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Schema> = (data) => console.log(data);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <div>
        <input
          defaultValue="test"
          {...register('example')}
          type="text"
          placeholder="Placeholder"
          className="px-2 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring"
        />
      </div>
      {/* errors will return when field validation fails  */}
      <span className="text-xs text-red-400">
        {errors.example?.message ?? '　'}
      </span>

      {/* include validation with required or other standard HTML validation rules */}
      <div>
        <input
          {...register('exampleRequired')}
          type="text"
          placeholder="Placeholder"
          className="px-2 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring"
        />
      </div>
      {/* errors will return when field validation fails  */}
      <span className="text-xs text-red-400">
        {errors.exampleRequired?.message ?? '　'}
      </span>
      <div>
        <input
          className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="submit"
        />
      </div>
    </form>
  );
};

export default Home;

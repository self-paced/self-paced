import { getSession } from 'next-auth/react';
import { ApiError } from 'next/dist/server/api-utils';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../../db/entity/User';
import RegisterUserInput from '../models/user/RegisterUserInput';
import { Context } from '../server';

@Resolver()
export default class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Context): Promise<User> {
    return await User.getCurrent(ctx);
  }

  @Mutation(() => User)
  async createUser(): Promise<User> {
    const user: User = await User.create({
      id: 1,
      firstName: 'First',
      lastName: 'Last',
    }).save();
    return user;
  }

  @Mutation(() => User)
  async registerUser(
    @Arg('input') input: RegisterUserInput,
    @Ctx() ctx: Context
  ): Promise<User> {
    const session = await getSession({ ctx });
    if (!session) throw new ApiError(403, 'Session Not Found!');
    const user: User = await User.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: session.user!.email!,
    }).save();
    return user;
  }
}

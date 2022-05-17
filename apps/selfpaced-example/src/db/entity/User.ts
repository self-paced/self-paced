import { getSession } from 'next-auth/react';
import { ApiError } from 'next/dist/server/api-utils';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
} from 'typeorm';
import { Context } from '../../graphql/server';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  firstName!: string;

  @Field()
  @Column()
  lastName!: string;

  @Field()
  @Column()
  @Index({ unique: true })
  email!: string;

  static async getCurrent(ctx: Context): Promise<User> {
    const session = await getSession({ ctx });
    if (!session) throw new ApiError(403, 'Session Not Found!');
    const user = await User.findOneBy({ email: session.user!.email! });
    if (!user) throw new ApiError(500, 'User logged in was not found!');
    return user;
  }
}

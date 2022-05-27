import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreateUserInput {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field({ nullable: true })
  isAdmin?: boolean;
}

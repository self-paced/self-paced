import { Field, InputType } from 'type-graphql';

@InputType()
export default class SetupAppInput {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}

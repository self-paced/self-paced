import { Field, InputType } from 'type-graphql';

@InputType()
export default class RegisterUserInput {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;
}

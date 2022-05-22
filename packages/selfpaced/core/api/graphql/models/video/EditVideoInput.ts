import { Field, ID, InputType } from 'type-graphql';

@InputType()
export default class EditVideoInput {
  @Field(() => ID)
  id!: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  url?: string;
}

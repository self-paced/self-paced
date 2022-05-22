import { Field, InputType, Int } from 'type-graphql';

@InputType()
export default class CreateVideoInput {
  @Field()
  title!: string;

  @Field()
  url!: string;

  @Field(() => Int)
  courseId!: number;
}

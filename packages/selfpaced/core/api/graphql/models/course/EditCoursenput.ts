import { Field, ID, InputType } from 'type-graphql';

@InputType()
export default class EditCourseInput {
  @Field(() => ID)
  id!: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageSrc?: string;
}

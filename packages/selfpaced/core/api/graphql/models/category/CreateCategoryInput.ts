import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreateCategoryInput {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field({ nullable: true })
  imageSrc?: string;
}

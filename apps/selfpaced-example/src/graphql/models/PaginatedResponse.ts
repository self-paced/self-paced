import { ClassType, Field, ObjectType } from 'type-graphql';

export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [TItemClass])
    items!: TItem[];

    @Field({ nullable: true })
    nextToken?: string;
  }
  return PaginatedResponseClass;
}

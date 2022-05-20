import { NonEmptyArray } from 'type-graphql';
import CourseResolver from './CourseResolver';
import UserResolver from './UserResolver';

export type ResolverList = NonEmptyArray<Function> | NonEmptyArray<string>;

const resolvers: ResolverList = [UserResolver, CourseResolver];

export default resolvers;

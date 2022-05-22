import { NonEmptyArray } from 'type-graphql';
import CourseResolver from './CourseResolver';
import UserResolver from './UserResolver';
import VideoResolver from './VideoResolver';

export type ResolverList = NonEmptyArray<Function> | NonEmptyArray<string>;

const resolvers: ResolverList = [UserResolver, CourseResolver, VideoResolver];

export default resolvers;

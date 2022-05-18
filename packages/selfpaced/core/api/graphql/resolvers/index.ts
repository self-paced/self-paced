import { NonEmptyArray } from 'type-graphql';
import UserResolver from './UserResolver';

export type ResolverList = NonEmptyArray<Function> | NonEmptyArray<string>;

const resolvers: ResolverList = [UserResolver];

export default resolvers;

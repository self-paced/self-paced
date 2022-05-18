import { NonEmptyArray } from 'type-graphql';
import CategoryResolver from './CategoryResolver';
import UserResolver from './UserResolver';

export type ResolverList = NonEmptyArray<Function> | NonEmptyArray<string>;

const resolvers: ResolverList = [UserResolver, CategoryResolver];

export default resolvers;

import 'reflect-metadata';
import apolloServerHandler from 'selfpaced/core/api/graphql/server';

export default apolloServerHandler;

export const config = { api: { bodyParser: false } };

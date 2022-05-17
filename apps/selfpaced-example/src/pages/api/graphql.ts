import 'reflect-metadata';
import apolloServerHandler from '../../graphql/server';

export default apolloServerHandler;

export const config = { api: { bodyParser: false } };

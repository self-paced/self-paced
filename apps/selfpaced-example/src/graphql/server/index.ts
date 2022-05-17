import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { NextApiRequest, NextApiResponse } from 'next';
import resolvers from '../../graphql/resolvers';
import { initDataSource } from '../../db/data-source';
import { IncomingMessage, OutgoingMessage } from 'http';

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const getApolloServer = async () => {
  await initDataSource();
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile:
      process.env.NODE_ENV == 'development'
        ? {
            path: process.cwd() + '/src/graphql/schema.graphql',
            sortedSchema: false,
          }
        : undefined,
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): Context => {
      return { req, res };
    },
  });
  await apolloServer.start();
  return apolloServer;
};

const apolloMiddleware = (await getApolloServer()).getMiddleware({
  path: '/api/graphql',
});

export interface Context {
  req: IncomingMessage;
  res: OutgoingMessage;
}

export default async function apolloServerHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, apolloMiddleware);
}

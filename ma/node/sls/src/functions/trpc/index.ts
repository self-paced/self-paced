import { getAPIBaseInfo } from '../../libs/helpers/lambdaHelper';

const { handlerDir, cors } = getAPIBaseInfo(__dirname);

const slsFunc = {
  handler: `${handlerDir}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '{proxy+}',
        cors: cors,
      },
    },
    {
      http: {
        method: 'post',
        path: '{proxy+}',
        cors: cors,
      },
    },
  ],
};

export default slsFunc;

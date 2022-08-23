import { getAPIBaseInfo } from '@libs/helpers/lambdaHelper';

const { handlerDir } = getAPIBaseInfo(__dirname);

const slsFunc = {
  handler: `${handlerDir}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '{proxy+}',
      },
    },
    {
      http: {
        method: 'post',
        path: '{proxy+}',
      },
    },
    {
      http: {
        method: 'options',
        path: '{proxy+}',
      },
    },
  ],
};

export default slsFunc;

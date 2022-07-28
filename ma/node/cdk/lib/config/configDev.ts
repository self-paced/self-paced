import { Config } from '.';

const configDev: Config = {
  env: { account: process.env.AWS_ACCOUNT_ID, region: 'ap-northeast-1' },
  envName: 'dev',
  azCount: 2,
};

export default configDev;

import { Config } from '.';

const configPrd: Config = {
  env: { account: process.env.AWS_ACCOUNT_ID, region: 'ap-northeast-1' },
  envName: 'prd',
  azCount: 3,
};

export default configPrd;

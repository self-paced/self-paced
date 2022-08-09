import { Config } from '.';

const configDEV: Config = {
  env: 'prd',
  region: 'ap-northeast-1',
  vpc: {
    securityGroupIds: [],
    subnetIds: [],
  },
  RDSProxyUserResource: 'dummy',
  dbEndpoint:
    'dummy-dev-rds-proxy.proxy-abcdefghijkl.ap-northeast-1.rds.amazonaws.com',
  database: 'maDb',
  dbPort: 3306,
  dbUser: 'ma',
  dbPassword: '',
  dbTimezone: '+09:00',
  lineToken: 'dummy',
};

export default configDEV;

import { Config } from '.';

const configDEV: Config = {
  env: 'dev',
  region: 'ap-northeast-1',
  vpc: {
    subnetIds: ['subnet-0d5bab7c618d2d5fe', 'subnet-0490eae6fc9584f90'],
    securityGroupIds: ['sg-03efa9df4c9fd45bb', 'sg-074198af7bc708e07'],
  },
  RDSProxyUserResource: 'dummy',
  dbEndpoint: 'slsdbproxy.proxy-cbu1mkv4zyru.ap-northeast-1.rds.amazonaws.com',
  dbPort: 3306,
  dbUser: 'ma',
  dbPassword: 'lHFn9yR4dzsCJKEE',
  dbTimezone: '+09:00',
  database: 'maDb',
  lineToken: 'dummy',
};

export default configDEV;

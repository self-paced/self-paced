import { Config } from '.';

const configLOCAL: Config = {
  env: 'local',
  region: 'ap-northeast-1',
  vpc: {
    securityGroupIds: [],
    subnetIds: [],
  },
  RDSProxyUserResource: 'dummy',
  dbEndpoint: 'localhost',
  dbPort: 3310,
  dbUser: 'root',
  dbPassword: 'root',
  dbTimezone: '+09:00',
  database: 'ma-db',
  lineToken: 'dummy',
};

export default configLOCAL;

import configLOCAL from './configLOCAL';
import configDEV from './configDEV';
import configPRD from './configPRD';
import { SLSVPC } from '@libs/helpers/serverlessHelper';

// const config = {
//   lineToken: process.env.LINE_TOKEN as string, // TODO: 削除（各ユーザは自分のトークンをDBに登録する）
// };

export interface Config {
  env: string;
  region: string;
  vpc: SLSVPC;
  RDSProxyUserResource: string;
  dbEndpoint: string;
  dbPort: number;
  dbUser: string;
  dbPassword?: string;
  dbTimezone: string;
  database: string;
  lineToken: string;
}

let config!: Config;

switch (process.env.ENV) {
  case 'prd':
    config = configPRD;
    break;
  case 'dev':
    config = configDEV;
    break;
  default:
    config = configLOCAL;
}

export default config;

export const allConfigs = {
  local: configLOCAL,
  dev: configDEV,
  prd: configPRD,
};

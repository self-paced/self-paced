import { Construct } from 'constructs';
import { Stack, aws_secretsmanager as secretsmanager } from 'aws-cdk-lib';
import { Config, constants } from '../../lib/config';
import { getVpc } from '../vpc';
// import { prepareFargateTask } from './task';
// import { prepareFargateService } from './service';
import { prepareRdsProxy } from './rds-proxy';

export class RdsProxy extends Stack {
  constructor(scope: Construct, id: string, props: Config) {
    super(scope, id, props);
    main(this, props);
  }
}

const main = async (scope: Construct, props: Config) => {
  const vpc = getVpc(scope, props);

  const dbSecret = prepareRdsProxySecret(scope, props);

  await prepareRdsProxy(scope, props, vpc, dbSecret);
};

// todo 一旦secretを使用しない
const prepareRdsProxySecret = (scope: Construct, props: Config) => {
  return new secretsmanager.Secret(scope, `maSlsDBSecret`, {
    secretName: `${constants.projectName}/${props.envName}/maBation`,
    description: `CDK generated ma bation secret`,
    generateSecretString: {
      secretStringTemplate: JSON.stringify({
        username: 'ma',
      }),
      generateStringKey: 'password',
      excludePunctuation: true,
      passwordLength: 16,
    },
  });
};

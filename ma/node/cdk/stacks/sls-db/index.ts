import { Construct } from 'constructs';
import { Stack, aws_secretsmanager as secretsmanager } from 'aws-cdk-lib';
import { Config, constants } from '../../lib/config';
import { getVpc } from '../vpc';
// import { prepareFargateTask } from './task';
// import { prepareFargateService } from './service';
import { prepareRds } from './sls-rds';

export class SlsDb extends Stack {
  constructor(scope: Construct, id: string, props: Config) {
    super(scope, id, props);
    main(this, props);
  }
}

const main = async (scope: Construct, props: Config) => {
  const vpc = getVpc(scope, props);

  const dbSecret = prepareDbSecret(scope, props);

  // const taskDef = await prepareFargateTask(scope, props, dbSecret);

  // const albFargateService = prepareFargateService(scope, props, vpc, taskDef);

  // await prepareRds(scope, props, vpc, dbSecret, [
  //   albFargateService.connections.securityGroups[0],
  // ]);

  await prepareRds(scope, props, vpc, dbSecret);
};

const prepareDbSecret = (scope: Construct, props: Config) => {
  return new secretsmanager.Secret(scope, `maSlsDBSecret`, {
    secretName: `${constants.projectName}/${props.envName}/maSls-db`,
    description: `CDK generated ma sls DB secret`,
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

import { Construct } from 'constructs';
import { Stack, aws_secretsmanager as secretsmanager } from 'aws-cdk-lib';
import { Config, constants } from '../../lib/config';
import { getVpc } from '../vpc';
import { prepareRds } from './rds';

export class Rds extends Stack {
  constructor(scope: Construct, id: string, props: Config) {
    super(scope, id, props);
    main(this, props);
  }
}

const main = async (scope: Construct, props: Config) => {
  const vpc = getVpc(scope, props);

  const dbSecret = prepareDbSecret(scope, props);

  await prepareRds(scope, props, vpc, dbSecret);
};

const prepareDbSecret = (scope: Construct, props: Config) => {
  return new secretsmanager.Secret(scope, `maDBSecret`, {
    secretName: `${constants.projectName}/${props.envName}/ma-db`,
    description: `CDK generated ma DB secret`,
    generateSecretString: {
      secretStringTemplate: JSON.stringify({
        username: 'ma',
      }),
      generateStringKey: 'password',
      excludePunctuation: true,
      passwordLength: 16,
      includeSpace: false,
    },
  });
};

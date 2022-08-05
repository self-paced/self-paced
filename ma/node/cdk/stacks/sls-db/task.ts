import { Construct } from 'constructs';
import {
  aws_iam as iam,
  aws_logs as logs,
  aws_secretsmanager as secretsmanager,
  aws_ecr as ecr,
  aws_ecs as ecs,
} from 'aws-cdk-lib';
import { logGroupExists } from '../../lib/helpers/awsHelper';
import { Config, constants } from '../../lib/config';
import { rdsEndpoint } from './sls-rds';

export const prepareFargateTask = async (
  scope: Construct,
  props: Config,
  dbSecret: secretsmanager.ISecret
) => {
  const logGroup = await prepareLogGroup(scope, props);

  const taskDef = new ecs.FargateTaskDefinition(scope, 'TaskDefinition', {
    memoryLimitMiB: 1024,
    cpu: 256,
    taskRole: createTaskRole(scope),
  });

  await prepareContainers(scope, props, taskDef, dbSecret, logGroup);
  return taskDef;
};

// eslint-disable-next-line max-lines-per-function
const createTaskRole = (scope: Construct) =>
  // TODO: 権限をしぼる
  new iam.Role(scope, 'TaskRole', {
    assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    inlinePolicies: {
      TaskPolicies: new iam.PolicyDocument({
        statements: [
          // SSMのecs execで、Containerの中に入るための権限
          new iam.PolicyStatement({
            sid: 'EcsExec',
            effect: iam.Effect.ALLOW,
            actions: [
              'ssmmessages:CreateControlChannel',
              'ssmmessages:CreateDataChannel',
              'ssmmessages:OpenControlChannel',
              'ssmmessages:OpenDataChannel',
            ],
            resources: ['*'],
          }),
          new iam.PolicyStatement({
            sid: 's3',
            effect: iam.Effect.ALLOW,
            actions: ['s3:*'],
            resources: ['*'],
          }),
          new iam.PolicyStatement({
            sid: 'batch',
            effect: iam.Effect.ALLOW,
            actions: ['batch:*'],
            resources: ['*'],
          }),
          new iam.PolicyStatement({
            sid: 'codebuild',
            effect: iam.Effect.ALLOW,
            actions: ['codebuild:*'],
            resources: ['*'],
          }),
          new iam.PolicyStatement({
            sid: 'secretsmanager',
            effect: iam.Effect.ALLOW,
            actions: ['secretsmanager:*'],
            resources: ['*'],
          }),
          new iam.PolicyStatement({
            sid: 'cloudformation',
            effect: iam.Effect.ALLOW,
            actions: ['cloudformation:*'],
            resources: ['*'],
          }),
          new iam.PolicyStatement({
            sid: 'elasticloadbalancing',
            effect: iam.Effect.ALLOW,
            actions: ['elasticloadbalancing:*'],
            resources: ['*'],
          }),
        ],
      }),
    },
  });

const prepareContainers = (
  scope: Construct,
  props: Config,
  taskDef: ecs.FargateTaskDefinition,
  dbSecret: secretsmanager.ISecret,
  logGroup: logs.ILogGroup
) => {
  prepareMaSlsDbContainer(scope, props, taskDef, dbSecret, logGroup);
};

const prepareLogGroup = async (scope: Construct, props: Config) => {
  const logGroupName = `${constants.projectName}-${props.envName}-maSlsDb`;
  const cfId = 'MaSlsDbLogGroup';
  let logGroup: logs.ILogGroup;
  if (await logGroupExists(logGroupName)) {
    logGroup = logs.LogGroup.fromLogGroupName(scope, cfId, logGroupName);
  } else {
    logGroup = new logs.LogGroup(scope, cfId, {
      logGroupName: logGroupName,
    });
  }
  return logGroup;
};

const prepareMaSlsDbContainer = (
  scope: Construct,
  props: Config,
  taskDef: ecs.FargateTaskDefinition,
  dbSecret: secretsmanager.ISecret,
  logGroup: logs.ILogGroup
) => {
  return new ecs.ContainerDefinition(scope, 'MaSlsDbContainerDefinition', {
    containerName: 'maSlsDb',
    image: ecs.ContainerImage.fromEcrRepository(
      ecr.Repository.fromRepositoryName(
        scope,
        'MaSlsDbRepository',
        'ecforce_maSlsDb'
      )
    ),
    secrets: {
      MYSQL_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, 'password'),
    },
    environment: {
      MYSQL_HOST: rdsEndpoint(props),
      MYSQL_PORT: '3306',
      MYSQL_USERNAME: 'ma',
      MYSQL_DATABASE: 'ma-db',
      AWS_REGION: 'ap-northeast-1',
    },
    logging: ecs.LogDriver.awsLogs({
      streamPrefix: 'log',
      logGroup: logGroup,
    }),
    taskDefinition: taskDef,
    readonlyRootFilesystem: false,
    portMappings: [{ containerPort: 80 }],
  });
};

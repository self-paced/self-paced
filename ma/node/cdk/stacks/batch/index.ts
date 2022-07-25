import { Construct } from 'constructs';
import * as aBatch from '@aws-cdk/aws-batch-alpha';
import {
  Stack,
  Duration,
  aws_ecs as ecs,
  aws_ecr as ecr,
  aws_iam as iam,
  aws_ec2 as ec2,
  aws_logs as logs,
  aws_elasticache as elasticache,
} from 'aws-cdk-lib';
import camelcase from 'camelcase';
import { Config, constants } from '../../lib/config';
import { getVpc } from '../vpc';
import { logGroupExists, sdkBatch } from '../../lib/helpers/awsHelper';
import jobs from './all-jobs';
import BatchRepo from './enums/BatchRepo';
import BatchJobDef from './models/BatchJobDef';
// import { projectName } from '../cicd/codebuild/create-shop';

export class Batch extends Stack {
  constructor(scope: Construct, id: string, props: Config) {
    super(scope, id, props);
    main(this, props);
  }
}

const main = async (scope: Construct, props: Config) => {
  const vpc = getVpc(scope, props);
  const batchSg = prepareBatchSecurityGroup(scope, props, vpc);
  const computeEnvironment = prepareComputeEnvironment(scope, props, vpc, batchSg);
  prepareJobQueue(scope, props, computeEnvironment);
  await prepareJobDefinitions(scope, props, jobs);
};

const prepareBatchSecurityGroup = (scope: Construct, props: Config, vpc: ec2.IVpc) => {
  return new ec2.SecurityGroup(scope, 'BatchSg', {
    securityGroupName: `${constants.projectName}-${props.envName}-batch-sg`,
    vpc,
  });
};

const prepareComputeEnvironment = (
  scope: Construct,
  props: Config,
  vpc: ec2.IVpc,
  batchSg: ec2.ISecurityGroup
) => {
  return new aBatch.ComputeEnvironment(scope, 'BatchComputeEnvironment', {
    computeEnvironmentName: computeEnvironmentName(props),
    computeResources: {
      type: aBatch.ComputeResourceType.FARGATE_SPOT,
      vpc,
      maxvCpus: 10,
      securityGroups: [batchSg],
    },
  });
};

const prepareJobQueue = (
  scope: Construct,
  props: Config,
  computeEnvironment: aBatch.IComputeEnvironment
) => {
  return new aBatch.JobQueue(scope, 'JobQueue', {
    jobQueueName: `${constants.projectName}-${props.envName}-queue`,
    computeEnvironments: [
      {
        computeEnvironment,
        order: 1,
      },
    ],
  });
};

// eslint-disable-next-line max-lines-per-function
const prepareJobDefinitions = async (
  scope: Construct,
  props: Config,
  jobs: BatchJobDef[]
) => {
  const repos = getRepos(scope);
  const logGroup = await prepareLogGroup(scope, props);
  const execRole = createExecutionRole(scope, props, logGroup, Object.values(repos));
  const jobRole = createJobRole(scope, props);
  jobs.forEach(job => {
    const jobDef = new aBatch.JobDefinition(
      scope,
      `Batch${camelcase(job.name, { pascalCase: true })}`,
      {
        jobDefinitionName: `${constants.projectName}-${props.envName}-${job.name}`,
        platformCapabilities: [aBatch.PlatformCapabilities.FARGATE],
        retryAttempts: job.retryAttempts,
        timeout: Duration.seconds(job.timeoutSeconds),
        parameters: job.parameters,

        container: {
          image: new ecs.EcrImage(repos[job.image], job.imageTag ?? 'latest'),
          assignPublicIp: true, // todo VPCを整理したら削除をする
          vcpus: job.vcpu,
          memoryLimitMiB: job.memory,
          command: job.command,
          executionRole: execRole,
          jobRole: jobRole,
          environment: {
            PROJECT_NAME: constants.projectName,
            ENV_NAME: props.envName,
            ECF_REDIS_HOST: `${constants.projectName}-${props.envName}-redis.m9bnsm.0001.apne1.cache.amazonaws.com`,
            ...job.environment,
          },
          logConfiguration: {
            logDriver: aBatch.LogDriver.AWSLOGS,
            options: {
              'awslogs-group': logGroup.logGroupName,
              'awslogs-stream-prefix': job.name,
            },
          },
        },
      }
    );
    jobDef.node.addDependency(execRole);
  });
};

const prepareLogGroup = async (scope: Construct, props: Config) => {
  const logGroupName = `${constants.projectName}-${props.envName}-batch`;
  const cfId = 'BatchLogGroup';
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

// eslint-disable-next-line max-lines-per-function
const createExecutionRole = (
  scope: Construct,
  props: Config,
  logGroup: logs.ILogGroup,
  repos: ecr.IRepository[]
) =>
  new iam.Role(scope, 'ExecutionRole', {
    roleName: `${constants.projectName}-${props.envName}-batch-exec-role`,
    assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    inlinePolicies: {
      TaskPolicies: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'ecr:BatchCheckLayerAvailability',
              'ecr:GetDownloadUrlForLayer',
              'ecr:BatchGetImage',
            ],
            resources: repos.map(repo => repo.repositoryArn),
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['ecr:GetAuthorizationToken'],
            resources: ['*'],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
            resources: [logGroup.logGroupArn],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
            resources: [
              `arn:aws:secretsmanager:${props.env.region}:${props.env.account}:secret:${constants.projectName}/${props.envName}/*`,
            ],
          }),
        ],
      }),
    },
  });

const createJobRole = (scope: Construct, props: Config) =>
  new iam.Role(scope, 'JobRole', {
    roleName: `${constants.projectName}-${props.envName}-batch-job-role`,
    assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    inlinePolicies: {
      TaskPolicies: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['s3:*'],
            resources: ['*'],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
            resources: [
              `arn:aws:secretsmanager:${props.env.region}:${props.env.account}:secret:${constants.projectName}/${props.envName}/*`,
              `arn:aws:secretsmanager:${props.env.region}:${props.env.account}:secret:ecf/${props.envName}/*`,
            ],
          }),
        ],
      }),
    },
  });

const getRepos = (scope: Construct) => {
  const repos: { [key: string]: ecr.IRepository } = {};
  for (const repoItem in BatchRepo) {
    const repoName = (BatchRepo as { [key: string]: string })[repoItem];
    repos[repoName] = ecr.Repository.fromRepositoryName(
      scope,
      `${camelcase(repoName, { pascalCase: true })}Repo`,
      repoName
    );
  }
  return repos as { [key in BatchRepo]: ecr.IRepository };
};



// export const getBatchSG = async (scope: Construct, props: Config) => {
//   const pjName = projectName(props);
//   const res = await sdkBatch
//     .describeComputeEnvironments({ computeEnvironments: [computeEnvironmentName(props)] })
//     .promise();
//   const sgIds =
//     res.computeEnvironments && res.computeEnvironments[0]
//       ? res.computeEnvironments[0].computeResources?.securityGroupIds
//       : undefined;
//   let sgId: string;
//   if (sgIds) {
//     sgId = sgIds[0];
//   } else {
//     console.warn(`Batch project not found: ${pjName}`);
//     return undefined;
//   }
//   return ec2.SecurityGroup.fromSecurityGroupId(scope, 'BatchSG', sgId, {
//     mutable: false,
//   });
// };

export const computeEnvironmentName = (props: Config) =>
  `${constants.projectName}-${props.envName}-batch`;
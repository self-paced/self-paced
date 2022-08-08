import { Construct } from 'constructs';
import {
  RemovalPolicy,
  aws_rds as rds,
  aws_ec2 as ec2,
  aws_secretsmanager as secretsmanager,
  aws_lambda as lambda,
  Duration,
  CustomResource,
  custom_resources as customresources,
} from 'aws-cdk-lib';
import { Config, constants } from '../../lib/config';
import { readdirSync } from 'fs';

export const prepareRds = (
  scope: Construct,
  props: Config,
  vpc: ec2.IVpc,
  dbSecret: secretsmanager.ISecret
  //allowedSGs: (ec2.ISecurityGroup | undefined)[]
) => {
  // create security groups
  const bastionGroup = new ec2.SecurityGroup(scope, 'Bastion to DB', {
    vpc: vpc,
  });
  const lambdaToRDSProxyGroup = new ec2.SecurityGroup(
    scope,
    'Lambda to RDSProxy',
    { vpc: vpc }
  );
  const dbConnectionGroup = new ec2.SecurityGroup(scope, 'Lambda to Proxy', {
    vpc: vpc,
  });

  // add security groups
  dbConnectionGroup.addIngressRule(
    dbConnectionGroup,
    ec2.Port.tcp(3306),
    'allow db connection'
  );

  dbConnectionGroup.addIngressRule(
    lambdaToRDSProxyGroup,
    ec2.Port.tcp(3306),
    'allow lambda connection'
  );

  dbConnectionGroup.addIngressRule(
    bastionGroup,
    ec2.Port.tcp(3306),
    'allow bastion connection'
  );

  // create Bastion server
  const host = new ec2.BastionHostLinux(scope, 'MaRDSProxy', {
    vpc,
    instanceType: ec2.InstanceType.of(
      ec2.InstanceClass.T4G,
      ec2.InstanceSize.NANO
    ),
    subnetSelection: {
      subnetType: ec2.SubnetType.PUBLIC,
    },
    securityGroup: bastionGroup,
  });

  host.instance.addUserData('yum -y update', 'yum install -y mysql jq');

  // RDSの認証情報
  // const databaseCredentialsSecret = new secretsmanager.Secret(
  //   scope,
  //   'DBCredentialsSecret',
  //   {
  //     secretName: 'ma-sls-rds-credentials',
  //     generateSecretString: {
  //       secretStringTemplate: JSON.stringify({
  //         username: 'syscdk',
  //       }),
  //       excludePunctuation: true,
  //       includeSpace: false,
  //       generateStringKey: 'password',
  //     },
  //   }
  // );

  // create RDS
  const cluster = new rds.DatabaseCluster(scope, 'MaSlsDB', {
    engine: rds.DatabaseClusterEngine.auroraMysql({
      version: rds.AuroraMysqlEngineVersion.VER_2_08_1,
    }),
    defaultDatabaseName: 'maDb',
    instanceProps: {
      vpc: vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.SMALL
      ),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
      },
      securityGroups: [dbConnectionGroup],
    },
    removalPolicy: RemovalPolicy.SNAPSHOT,
    credentials: rds.Credentials.fromSecret(dbSecret),
  });

  if (!cluster.secret) {
    throw new Error('DB not use secret');
  }

  // create RDS proxy
  new rds.DatabaseProxy(scope, 'SlsDbProxy', {
    proxyTarget: rds.ProxyTarget.fromCluster(cluster),
    secrets: [dbSecret],
    securityGroups: [dbConnectionGroup],
    vpc: vpc,
    maxConnectionsPercent: 80,
  });

  console.log(cluster.secret.secretValue);

  // Migration
  const migrateFunction = new lambda.DockerImageFunction(
    scope,
    'migrateSlsDB',
    {
      vpc,
      architecture: lambda.Architecture.ARM_64,
      timeout: Duration.minutes(5),
      code: lambda.DockerImageCode.fromImageAsset(
        __dirname + './../../../sls/.'
      ),
      environment: {
        DB_CONNECTION: cluster.secret.secretValue.toString(),
      },
    }
  );
  cluster.connections.allowDefaultPortFrom(migrateFunction);

  // Lambda will migrate every schema changes
  const provider = new customresources.Provider(scope, 'SlsDbProvider', {
    onEventHandler: migrateFunction,
  });

  const lastMigrationId = readdirSync(
    __dirname + '/../../../sls/prisma/migrations'
  )
    .filter((name) => name !== 'migration_lock.toml')
    .sort()
    .reverse()[0];

  new CustomResource(scope, 'Custom::Migration', {
    serviceToken: provider.serviceToken,
    properties: {
      lastMigrationId,
    },
  });
};

const clusterName = (props: Config) =>
  `${constants.projectName}-${props.envName}-maSls`;

// export const rdsEndpoint = (props: Config) =>
//   `${clusterName(props)}.cluster-cddtmzgk4ohl.ap-northeast-1.rds.amazonaws.com`;

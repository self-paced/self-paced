import { Construct } from 'constructs';
import {
  RemovalPolicy,
  aws_rds as rds,
  aws_ec2 as ec2,
  aws_secretsmanager as secretsmanager,
} from 'aws-cdk-lib';
import { Config, constants } from '../../lib/config';

export const prepareRds = (
  scope: Construct,
  props: Config,
  vpc: ec2.IVpc,
  dbSecret: secretsmanager.ISecret
  //allowedSGs: (ec2.ISecurityGroup | undefined)[]
) => {
  console.log('create cluster');
  const maSlsDb = new rds.ServerlessCluster(scope, 'MaSlsDB', {
    vpc: vpc,
    clusterIdentifier: clusterName(props),
    defaultDatabaseName: 'maDb',
    engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
    scaling: {
      minCapacity: rds.AuroraCapacityUnit.ACU_1,
      maxCapacity: rds.AuroraCapacityUnit.ACU_16,
    },
    // vpcSubnets: {
    //   subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
    // },
    removalPolicy: RemovalPolicy.SNAPSHOT,
    //credentials: rds.Credentials.fromSecret(dbSecret),
    credentials: rds.Credentials.fromGeneratedSecret('clusteradmin'),
  });

  // allowedSGsからのRDSアクセスを許可する
  // allowedSGs.forEach((sg) => {
  //   if (sg) maSlsDb.connections.allowFrom(sg, ec2.Port.tcp(3306));
  // });
};

const clusterName = (props: Config) =>
  `${constants.projectName}-${props.envName}-maSls`;

export const rdsEndpoint = (props: Config) =>
  `${clusterName(props)}.cluster-cddtmzgk4ohl.ap-northeast-1.rds.amazonaws.com`;

import { Construct } from 'constructs';
import {
  aws_ecs as ecs,
  aws_ec2 as ec2,
  aws_elasticloadbalancingv2 as elbv2,
} from 'aws-cdk-lib';
import { Config, constants } from '../../lib/config';

export const prepareFargateService = (
  scope: Construct,
  props: Config,
  vpc: ec2.IVpc,
  taskDef: ecs.FargateTaskDefinition
) => {
  const alb = prepareAlb(scope, props, vpc);

  console.log('vpc:' + vpc);

  console.log('ecs cluster');
  const ecsCluster = new ecs.Cluster(scope, 'MaSlsDbCluster', {
    clusterName: `${constants.projectName}-${props.envName}-maSlsDb-cluster`,
    vpc: vpc,
  });

  console.log('security group');
  const securityGroups: ec2.ISecurityGroup[] = [];
  securityGroups.push(
    new ec2.SecurityGroup(scope, 'FargateServiceSg', {
      securityGroupName: `${constants.projectName}-${props.envName}-maSlsDb-service-sg`,
      vpc,
    })
  );

  const fargateService = new ecs.FargateService(scope, 'FargateService', {
    serviceName: `${constants.projectName}-${props.envName}-maSlsDb-service`,
    cluster: ecsCluster,
    taskDefinition: taskDef,
    desiredCount: 1,
    enableExecuteCommand: true,
    platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    securityGroups: securityGroups,
  });

  fargateService.registerLoadBalancerTargets({
    containerName: 'maSlsDb',
    containerPort: 80,
    newTargetGroupId: `${constants.projectName}-${props.envName}-maSlsDb-tg`,
    listener: ecs.ListenerConfig.applicationListener(
      alb.addListener(`ListenerMaSlsDb`, {
        open: false,
        port: 443,
        certificates: [elbv2.ListenerCertificate.fromArn(props.maSlsDbCertArn)],
      })
      // {
      //   healthCheck: {
      //     path: '/api/auth/signin',
      //     healthyThresholdCount: 2,
      //     unhealthyThresholdCount: 8,
      //   },
      // }
    ),
  });

  return fargateService;
};

const prepareAlb = (scope: Construct, props: Config, vpc: ec2.IVpc) => {
  const albSecurityGroup = new ec2.SecurityGroup(
    scope,
    'maSlsDbLoadBalancerSG',
    {
      securityGroupName: `${constants.projectName}-${props.envName}-maSlsDb-alb-sg`,
      vpc: vpc,
      allowAllOutbound: false,
    }
  );
  // SPSTのIP制限
  // constants.whitelistIPs.forEach((ip) => {
  //   [80, 443].forEach((port) => {
  //     albSecurityGroup.addIngressRule(
  //       ec2.Peer.ipv4(ip),
  //       ec2.Port.tcp(port),
  //       'Allow SPST IP'
  //     );
  //   });
  // });
  const alb = new elbv2.ApplicationLoadBalancer(scope, 'MaSlsDbALB', {
    loadBalancerName: `${constants.projectName}-${props.envName}-maSlsDb-alb`,
    vpc: vpc,
    securityGroup: albSecurityGroup,
    internetFacing: true,
  });
  alb.addListener('HttpsRedirectListener', {
    open: false,
    port: 80,
    defaultAction: elbv2.ListenerAction.redirect({
      host: '#{host}',
      path: '/#{path}',
      port: '443',
      protocol: 'HTTPS',
      query: '#{query}',
      permanent: true,
    }),
  });
  return alb;
};

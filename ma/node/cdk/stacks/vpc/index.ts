import { Construct } from 'constructs';
import { Stack, aws_ec2 as ec2 } from 'aws-cdk-lib';
import { Config, constants } from '../../lib/config';

export class Vpc extends Stack {
  constructor(scope: Construct, id: string, props: Config) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: props.azCount,
      cidr: '10.10.0.0/16',
      vpcName: vpcName(props),
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'application',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        },
        {
          cidrMask: 28,
          name: 'rds',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // VPCコンストラクトでサブネットのCidrBlockの設定ができないため、以下の上書きで設定します。
    vpc.publicSubnets.forEach((subnet, index) => {
      const cfnSubnet = subnet.node.defaultChild as ec2.CfnSubnet;
      cfnSubnet.addPropertyOverride('CidrBlock', `10.10.${10 + index}.0/24`);
    });
    vpc.privateSubnets.forEach((subnet, index) => {
      const cfnSubnet = subnet.node.defaultChild as ec2.CfnSubnet;
      cfnSubnet.addPropertyOverride('CidrBlock', `10.10.${20 + index}.0/24`);
    });

    // ECRエンドポイント
    vpc.addInterfaceEndpoint('ecr-endpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
    });
    vpc.addInterfaceEndpoint('ecr-dkr-endpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
    });
    vpc.addGatewayEndpoint('s3-endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });
  }
}

const vpcName = (props: Config) =>
  `${constants.projectName}-${props.envName}-vpc`;

/**
 * Get the vpc object to use in other stacks
 */
export const getVpc = (scope: Construct, props: Config) => {
  return ec2.Vpc.fromLookup(scope, 'Vpc', {
    vpcName: vpcName(props),
  });
};

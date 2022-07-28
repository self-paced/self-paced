import { Construct } from 'constructs';
import { Stack, aws_ec2 as ec2 } from 'aws-cdk-lib';
import { Config, constants } from '../../lib/config';

export class Vpc extends Stack {
  constructor(scope: Construct, id: string, props: Config) {
    super(scope, id, props);

    new ec2.Vpc(this, 'Vpc', {
      maxAzs: props.azCount,
      cidr: '10.10.0.0/16',
      vpcName: vpcName(props),
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        // {
        //   name: 'isolated',
        //   subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        // },
      ],
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

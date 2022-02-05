import { readFileSync } from "fs";
import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  AmazonLinuxCpuType,
  AmazonLinuxGeneration,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class SimpleEC2Stack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const defaultVpc = new Vpc(this, "VPC", {
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "asterisk",
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });

    const role = new Role(this, "simple-ec2-role", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
    });

    const securityGroup = new SecurityGroup(this, "simple-instance-1-sg", {
      vpc: defaultVpc,
      allowAllOutbound: true,
      securityGroupName: "simple-instance-1-sg",
    });
    securityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(22),
      "Allow SSH Access from Internet"
    );
    securityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(80),
      "Allow HTTP Access from Internet"
    );
    securityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(443),
      "Allow HTTPS Access from Internet"
    );

    const instance = new Instance(this, "simple-instante-1", {
      vpc: defaultVpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      role: role,
      securityGroup: securityGroup,
      instanceName: "simple-instante-1",
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: MachineImage.latestAmazonLinux({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
        cpuType: AmazonLinuxCpuType.X86_64,
      }),
      keyName: "simple-instance-1-key",
    });

    instance.addUserData(readFileSync("src/lib/user_script.sh", "utf-8"));

    new CfnOutput(this, "simple-instante-1-output", {
      value: instance.instancePublicIp,
    });
  }
}

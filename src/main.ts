import { App } from "aws-cdk-lib";
import { SimpleEC2Stack } from "./simple-ec2-stack";

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new SimpleEC2Stack(app, "simple-ec2-dev", { env: devEnv });
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();

import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { SimpleEC2Stack } from "../src/simple-ec2-stack";

test("Snapshot", () => {
  const app = new App();
  const stack = new SimpleEC2Stack(app, "test");

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});

test("Check InstanceType annd SSH KeyName", () => {
  const app = new App();
  const stack = new SimpleEC2Stack(app, "test");

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::EC2::Instance", {
    InstanceType: "t2.micro",
    KeyName: "simple-instance-1-key",
  });
});

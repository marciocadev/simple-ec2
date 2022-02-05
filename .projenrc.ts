import { awscdk } from "projen";
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.10.0",
  defaultReleaseBranch: "main",
  name: "simple-ec2",
  projenrcTs: true,

  prettier: true,
});
project.synth();

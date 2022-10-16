import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Streamlink } from '../src';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'StreamlinkServerless', {
  env: {
    region: 'eu-west-2',
  },
});

const backend = new Streamlink(stack, 'Backend', {});

const endpoint = new lambda.FunctionUrl(stack, 'Endpoint', {
  function: backend.function,
  authType: lambda.FunctionUrlAuthType.NONE,
});

new cdk.CfnOutput(stack, 'EndpointUrl', {
  value: endpoint.url,
});

app.synth();
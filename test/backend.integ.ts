import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { Streamlink } from '../src';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'StreamlinkServerless');

const backend = new Streamlink(stack, 'Backend', {});

new lambda.FunctionUrl(stack, 'Endpoint', {
  function: backend.function,
  authType: FunctionUrlAuthType.NONE,
});

app.synth();
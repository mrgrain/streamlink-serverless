import * as cdk from 'aws-cdk-lib';
import { Streamlink } from '../src';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'StreamlinkServerless');

new Streamlink(stack, 'Backend', {});

app.synth();
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Streamlink } from '../src';

describe('Streamlink', () => {
  test('creates a Function', () => {
    const stack = new cdk.Stack();
    new Streamlink(stack, 'MyStreamlink', {});

    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();
  });
});
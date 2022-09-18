import { join } from 'path';
import * as cdk from 'aws-cdk-lib';
import { BundlingOutput, DockerImage } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface StreamlinkProps {
}

export class Streamlink extends Construct {
  public readonly function: lambda.Function;

  public constructor(scope: Construct, id: string, _props: StreamlinkProps) {
    super(scope, id);

    const streamlinkApp = join(__dirname, '..', 'streamlink');

    const layer = new lambda.LayerVersion(this, 'Layer', {
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_8],
      code: lambda.Code.fromAsset(streamlinkApp, {
        bundling: {
          image: DockerImage.fromRegistry('lambci/lambda:build-python3.8'),
          workingDirectory: '/var/tasks',
          user: 'root',
          command: [
            'bash', '-c',
            'pip install --upgrade streamlink lxml -t python/lib/python3.8/site-packages/ && zip -FSrq /asset-output/layer.zip python',
          ],
          outputType: BundlingOutput.ARCHIVED,
        },
      }),
    });

    this.function = new lambda.Function(this, 'Default', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'app.handler',
      code: lambda.Code.fromAsset(streamlinkApp),
      memorySize: 512,
      timeout: cdk.Duration.seconds(5),
      layers: [layer],
    });
  }
}
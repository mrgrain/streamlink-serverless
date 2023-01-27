import { join } from 'path';
import * as cdk from 'aws-cdk-lib';
import { BundlingFileAccess, BundlingOutput, DockerImage } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface StreamlinkProps {
}

export class Streamlink extends Construct {
  public readonly function: lambda.Function;

  public constructor(scope: Construct, id: string, _props: StreamlinkProps = {}) {
    super(scope, id);

    const runtime = Runtime.PYTHON_3_9;
    const streamlinkApp = join(__dirname, '..', 'streamlink');

    const layer = new lambda.LayerVersion(this, 'Layer', {
      compatibleRuntimes: [runtime],
      code: lambda.Code.fromAsset(streamlinkApp, {
        bundling: {
          image: DockerImage.fromBuild(streamlinkApp),
          workingDirectory: '/build',
          command: [
            'bash', '-c',
            `pip install --upgrade aws_lambda_types streamlink lxml -t python/lib/${runtime.name}/site-packages/ && zip -rq /asset-output/layer.zip python`,
          ],
          outputType: BundlingOutput.ARCHIVED,
          bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
        },
      }),
    });

    this.function = new lambda.Function(this, 'Default', {
      runtime,
      handler: 'app.handler',
      code: lambda.Code.fromAsset(streamlinkApp),
      memorySize: 512,
      timeout: cdk.Duration.seconds(5),
      layers: [layer],
    });
  }
}
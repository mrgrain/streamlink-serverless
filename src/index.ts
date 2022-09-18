import { join } from 'path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface StreamlinkProps {
}

export class Streamlink extends Construct {
  public readonly function: lambda.Function;

  public constructor(scope: Construct, id: string, _props: StreamlinkProps) {
    super(scope, id);

    const layer = new lambda.LayerVersion(this, 'Layer', {
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_8],
      code: lambda.Code.fromAsset(join(__dirname, '..', 'app', 'layer.zip')),
    });

    this.function = new lambda.Function(this, 'Default', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'app.handler',
      code: lambda.Code.fromAsset(join(__dirname, '..', 'app', 'handler.zip')),
      memorySize: 512,
      timeout: cdk.Duration.seconds(5),
      layers: [layer],
    });
  }
}
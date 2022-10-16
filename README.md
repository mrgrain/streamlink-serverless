
<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/mrgrain/streamlink-serverless/main/images/wordmark-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/mrgrain/streamlink-serverless/main/images/wordmark-light.svg">
    <img src="https://raw.githubusercontent.com/mrgrain/streamlink-serverless/main/images/wordmark-dynamic.svg" alt="streamlink-serverless">
</picture>

_Streamlink as a Serverless Service_ | [Getting started](#getting-started) |
[Usage](#usage) |
[FAQ](#faq)

[![View on Construct Hub](https://constructs.dev/badge?package=streamlink-serverless)](https://constructs.dev/packages/streamlink-serverless)

## Getting started

Streamlink Serverless is a CDK construct to run Streamlink as a serverless Lambda Function on AWS.

### Requirements

- [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)
- [Docker](https://docs.docker.com/get-docker/) (to bundle the Streamlink Serverless Lambda Function)

### Installation

Add Streamlink Serverless to a new or existing [AWS CDK app in the language of your choice](https://docs.aws.amazon.com/cdk/v2/guide/hello_world.html):

#### Node.js

```sh
# npm 
npm install streamlink-serverless
# Yarn
yarn add streamlink-serverless
# pnpm
pnpm add streamlink-serverless
```

#### Other languages

```sh
# Python
pip install streamlink-serverless

# Dotnet
dotnet add package StreamlinkServerless
```

### Full example

This example creates a Stack with a Streamlink Serverless backend and publishes the service behind a Function URL. Finally an output returns the service URL for immediate use.

```ts
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Streamlink } from 'streamlink-serverless';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Streamlink');

const streamlink = new Streamlink(stack, 'Backend');

const endpoint = new lambda.FunctionUrl(stack, 'Endpoint', {
  function: backend.function,
  authType: lambda.FunctionUrlAuthType.NONE,
});

new cdk.CfnOutput(stack, 'EndpointUrl', {
  value: endpoint.url,
});

app.synth();
```

## Usage

Once deployed, you can use your Streamlink Serverless service like this:
`https://example.com/live/youtube.com/c/NASA.m3u8`

### URL format

`https://<endpoint>/live/<url>/<stream>.<type>`

- `<endpoint>`\
  The endpoint URL of the Streamlink Serverless deployment.
- `<url>`\
  A URL to attempt to extract streams from.
  Usually, the protocol of http(s) URLs can be omitted (https://).
- `<stream>`\
  Stream to play.
  Use `best` or `worst` for selecting the highest or lowest available quality.
- `<type>`\
  Type of the returned stream. Needed by some players for correct playback.
  Use `m3u8` for HLS streams or `mpd` for Dash streams.

## FAQ

Feel free to open an issue for any unaddressed questions.

### 🌍 Does it work with geo-blocking?

Make sure to deploy Streamlink Serverless into the region you intend to watch streams from. Most services are already geo-blocked when trying to retrieve the stream URL. E.g. if you are based in `London, United Kingdom` deploy to `eu-west-2`.

See [this blog post for detailed instructions](https://bobbyhadz.com/blog/set-region-account-cdk-deploy).

### 💰 How much does it cost to run?

The [pricing model for AWS Lambda](https://aws.amazon.com/lambda/pricing/) is based on number of request and duration of the execution. It also offers a generous "always free" allocation via [AWS Free Tier](https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=tier%23always-free&awsf.Free%20Tier%20Categories=*all&all-free-tier.q=AWS%2BLambda&all-free-tier.q_operator=AND).

While cost predications are incredible difficult to make, it seems possible to  run Streamlink Serverless for personal use only within the bounds of AWS Free Tier.

Always set up [billing alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html) to avoid unexpected costs.

### 🔐 Why does it have no authentication or password protection?

Adding appropriate authentication is your responsibility. Putting any unprotected URL online makes you susceptible to occurring unexpected cost.

**Streamlink Serverless does not offer built-in password protection**, because the pricing model for AWS Lambda charges for number of requests and duration of the execution. This means that you would still be charged for any unauthenticated requests if password protection were to be handled inside the Lambda Function. While there might be some savings from shorter execution times and the deterrent of an unusable service, it is much safer to deploy a proper authentication mechanism.

The simplest way would be to enable `AWS_IAM` auth on the Lambda Function URL ([see docs](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html#urls-auth-iam)). However IAM authentication is likely not compatible with the intended use case of using Streamlink Serverless URLs as IPTV playlists, as it involves signing requests.

A more advanced approach would be to deploy Streamlink Serverless as part of an API Gateway HTTP API and [configure an authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-access-control.html) according to your needs.

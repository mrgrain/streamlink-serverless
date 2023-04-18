
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
const app = new cdk.App();
const stack = new cdk.Stack(app, 'Streamlink');

const streamlink = new Streamlink(stack, 'Backend');

const endpoint = new lambda.FunctionUrl(stack, 'Endpoint', {
  function: streamlink.function,
  authType: lambda.FunctionUrlAuthType.NONE,
});

new cdk.CfnOutput(stack, 'EndpointUrl', {
  value: endpoint.url,
});

app.synth();
```

## Usage

Once deployed, you can use your Streamlink Serverless service like this:
`https://example.com/live/youtube.com/@NASA/best.m3u8`

### URL formats

`https://<endpoint>/live/<url>`\
Simply put the stream URL behind your endpoint.

- `<endpoint>`\
  The endpoint URL of the Streamlink Serverless deployment.
- `<url>`\
  A URL to attempt to extract streams from.
  Usually, the protocol of http(s) URLs can be omitted.

`https://<endpoint>/live/<url>/<stream>.<type>`\
This format allows selecting a specific stream quality and format.

- `<stream>`\
  Stream to play.
  Use `best` or `worst` for selecting the highest or lowest available quality.
  Optional.
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

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Streamlink <a name="Streamlink" id="streamlink-serverless.Streamlink"></a>

#### Initializers <a name="Initializers" id="streamlink-serverless.Streamlink.Initializer"></a>

```typescript
import { Streamlink } from 'streamlink-serverless'

new Streamlink(scope: Construct, id: string, _props?: StreamlinkProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#streamlink-serverless.Streamlink.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#streamlink-serverless.Streamlink.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#streamlink-serverless.Streamlink.Initializer.parameter._props">_props</a></code> | <code><a href="#streamlink-serverless.StreamlinkProps">StreamlinkProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="streamlink-serverless.Streamlink.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="streamlink-serverless.Streamlink.Initializer.parameter.id"></a>

- *Type:* string

---

##### `_props`<sup>Optional</sup> <a name="_props" id="streamlink-serverless.Streamlink.Initializer.parameter._props"></a>

- *Type:* <a href="#streamlink-serverless.StreamlinkProps">StreamlinkProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#streamlink-serverless.Streamlink.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="streamlink-serverless.Streamlink.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#streamlink-serverless.Streamlink.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="streamlink-serverless.Streamlink.isConstruct"></a>

```typescript
import { Streamlink } from 'streamlink-serverless'

Streamlink.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="streamlink-serverless.Streamlink.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#streamlink-serverless.Streamlink.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#streamlink-serverless.Streamlink.property.function">function</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="streamlink-serverless.Streamlink.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `function`<sup>Required</sup> <a name="function" id="streamlink-serverless.Streamlink.property.function"></a>

```typescript
public readonly function: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

---


## Structs <a name="Structs" id="Structs"></a>

### StreamlinkProps <a name="StreamlinkProps" id="streamlink-serverless.StreamlinkProps"></a>

#### Initializer <a name="Initializer" id="streamlink-serverless.StreamlinkProps.Initializer"></a>

```typescript
import { StreamlinkProps } from 'streamlink-serverless'

const streamlinkProps: StreamlinkProps = { ... }
```





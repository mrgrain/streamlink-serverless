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





# Class: RingBuffer\<T\>

[telemetry/utils/ringBuffer](../modules/telemetry_utils_ringBuffer.md).RingBuffer

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Constructors

- [constructor](telemetry_utils_ringBuffer.RingBuffer.md#constructor)

### Properties

- [buf](telemetry_utils_ringBuffer.RingBuffer.md#buf)
- [max](telemetry_utils_ringBuffer.RingBuffer.md#max)

### Methods

- [push](telemetry_utils_ringBuffer.RingBuffer.md#push)
- [toArray](telemetry_utils_ringBuffer.RingBuffer.md#toarray)

## Constructors

### constructor

• **new RingBuffer**\<`T`\>(`max`): [`RingBuffer`](telemetry_utils_ringBuffer.RingBuffer.md)\<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `max` | `number` |

#### Returns

[`RingBuffer`](telemetry_utils_ringBuffer.RingBuffer.md)\<`T`\>

#### Defined in

src/telemetry/utils/ringBuffer.ts:5

## Properties

### buf

• `Private` **buf**: `T`[]

#### Defined in

src/telemetry/utils/ringBuffer.ts:3

___

### max

• `Private` `Readonly` **max**: `number`

#### Defined in

src/telemetry/utils/ringBuffer.ts:2

## Methods

### push

▸ **push**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `T` |

#### Returns

`void`

#### Defined in

src/telemetry/utils/ringBuffer.ts:10

___

### toArray

▸ **toArray**(): `T`[]

#### Returns

`T`[]

#### Defined in

src/telemetry/utils/ringBuffer.ts:18

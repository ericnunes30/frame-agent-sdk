# Module: providers/utils/stream

## Table of contents

### Functions

- [stream](providers_utils_stream.md#stream)

## Functions

### stream

▸ **stream**\<`T`\>(`stream`): `AsyncIterable`\<`T`\>

Transforma um stream de chunks da API em um iterador assíncrono.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream` | `AsyncIterable`\<`T`\> | O stream retornado pela API. |

#### Returns

`AsyncIterable`\<`T`\>

Um iterador assíncrono que emite cada chunk do stream.

#### Defined in

providers/utils/stream.ts:6

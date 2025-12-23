# Module: memory/utils/messageContentUtils

## Table of contents

### Functions

- [extractText](memory_utils_messageContentUtils.md#extracttext)
- [extractTextFromMessage](memory_utils_messageContentUtils.md#extracttextfrommessage)
- [hasImages](memory_utils_messageContentUtils.md#hasimages)
- [isContentParts](memory_utils_messageContentUtils.md#iscontentparts)
- [sanitizeForLogs](memory_utils_messageContentUtils.md#sanitizeforlogs)

## Functions

### extractText

▸ **extractText**(`content`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`MessageContent`](memory_memory_interface.md#messagecontent) |

#### Returns

`string`

#### Defined in

src/memory/utils/messageContentUtils.ts:7

___

### extractTextFromMessage

▸ **extractTextFromMessage**(`message`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`Message`](../interfaces/memory_memory_interface.Message.md) |

#### Returns

`string`

#### Defined in

src/memory/utils/messageContentUtils.ts:15

___

### hasImages

▸ **hasImages**(`content`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`MessageContent`](memory_memory_interface.md#messagecontent) |

#### Returns

`boolean`

#### Defined in

src/memory/utils/messageContentUtils.ts:19

___

### isContentParts

▸ **isContentParts**(`content`): content is ContentPart[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`MessageContent`](memory_memory_interface.md#messagecontent) |

#### Returns

content is ContentPart[]

#### Defined in

src/memory/utils/messageContentUtils.ts:3

___

### sanitizeForLogs

▸ **sanitizeForLogs**(`content`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`MessageContent`](memory_memory_interface.md#messagecontent) |

#### Returns

`string`

#### Defined in

src/memory/utils/messageContentUtils.ts:60

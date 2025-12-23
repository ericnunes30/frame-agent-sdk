# Module: orchestrators/graph/nodes/toolDetectionNode

## Table of contents

### Functions

- [createToolDetectionNode](orchestrators_graph_nodes_toolDetectionNode.md#createtooldetectionnode)

## Functions

### createToolDetectionNode

▸ **createToolDetectionNode**(): [`GraphNode`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md)

Cria um nó de detecção de ferramentas.
Este nó analisa a última mensagem do estado (geralmente do LLM) e tenta detectar uma chamada de ferramenta.
Se detectado com sucesso, preenche `state.lastToolCall` e salva no histórico apenas saídas válidas.
Se houver erro de detecção, preenche metadados para feedback ao LLM.

#### Returns

[`GraphNode`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md)

#### Defined in

[src/orchestrators/graph/nodes/toolDetectionNode.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/toolDetectionNode.ts#L14)

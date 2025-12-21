# Module: orchestrators/graph/nodes/reactValidationNode

## Table of contents

### Functions

- [createReactValidationNode](orchestrators_graph_nodes_reactValidationNode.md#createreactvalidationnode)

## Functions

### createReactValidationNode

▸ **createReactValidationNode**(): [`GraphNode`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md)

Cria um nó de validação de formato ReAct.
Este nó verifica se a última saída do modelo segue o formato ReAct correto.
O resultado da validação é armazenado em metadata.validation para uso por outros nós.

#### Returns

[`GraphNode`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md)

#### Defined in

[src/orchestrators/graph/nodes/reactValidationNode.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/nodes/reactValidationNode.ts#L10)

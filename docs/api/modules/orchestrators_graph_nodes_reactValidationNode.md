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

[src/orchestrators/graph/nodes/reactValidationNode.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/reactValidationNode.ts#L10)

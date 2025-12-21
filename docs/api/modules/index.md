# Module: index

## Table of contents

### References

- [AGENT\_MODES](index.md#agent_modes)
- [AgentExecutionOptions](index.md#agentexecutionoptions)
- [AgentExecutionResult](index.md#agentexecutionresult)
- [AgentInfo](index.md#agentinfo)
- [AgentLLM](index.md#agentllm)
- [AgentLLMConfig](index.md#agentllmconfig)
- [AgentMode](index.md#agentmode)
- [AgentModeType](index.md#agentmodetype)
- [AgentModeUtil](index.md#agentmodeutil)
- [AgentRegistrationOptions](index.md#agentregistrationoptions)
- [AgentRegistry](index.md#agentregistry)
- [AgentRegistryInfo](index.md#agentregistryinfo)
- [AgentRegistryInstance](index.md#agentregistryinstance)
- [AgentRegistryStats](index.md#agentregistrystats)
- [AgentStepConfig](index.md#agentstepconfig)
- [AgentType](index.md#agenttype)
- [ApprovalParams](index.md#approvalparams)
- [ApprovalTool](index.md#approvaltool)
- [AskUserParams](index.md#askuserparams)
- [AskUserTool](index.md#askusertool)
- [CallFlowParams](index.md#callflowparams)
- [CallFlowTool](index.md#callflowtool)
- [ChatHistoryConfig](index.md#chathistoryconfig)
- [ChatHistoryManager](index.md#chathistorymanager)
- [ConditionalEdge](index.md#conditionaledge)
- [DEFAULT\_AGENT\_CONFIG](index.md#default_agent_config)
- [DEFAULT\_TELEMETRY\_OPTIONS](index.md#default_telemetry_options)
- [ExecuteOptions](index.md#executeoptions)
- [FileCreateTool](index.md#filecreatetool)
- [FileEditTool](index.md#fileedittool)
- [FileReadTool](index.md#filereadtool)
- [FinalAnswerParams](index.md#finalanswerparams)
- [FinalAnswerTool](index.md#finalanswertool)
- [FlowDefinition](index.md#flowdefinition)
- [FlowKind](index.md#flowkind)
- [FlowRegistry](index.md#flowregistry)
- [FlowRegistryImpl](index.md#flowregistryimpl)
- [FlowRunner](index.md#flowrunner)
- [FlowRunnerImpl](index.md#flowrunnerimpl)
- [GraphBuilder](index.md#graphbuilder)
- [GraphBuilderOptions](index.md#graphbuilderoptions)
- [GraphDefinition](index.md#graphdefinition)
- [GraphEngine](index.md#graphengine)
- [GraphNode](index.md#graphnode)
- [GraphNodeControl](index.md#graphnodecontrol)
- [GraphNodeResult](index.md#graphnoderesult)
- [GraphRunResult](index.md#graphrunresult)
- [GraphStatus](index.md#graphstatus)
- [IAgent](index.md#iagent)
- [IAgentConfig](index.md#iagentconfig)
- [IAgentRegistry](index.md#iagentregistry)
- [IChatHistoryManager](index.md#ichathistorymanager)
- [IGraphBuilder](index.md#igraphbuilder)
- [IGraphState](index.md#igraphstate)
- [IProviderResponse](index.md#iproviderresponse)
- [ISAPError](index.md#isaperror)
- [IStepsOrchestrator](index.md#istepsorchestrator)
- [ITokenizerService](index.md#itokenizerservice)
- [ITool](index.md#itool)
- [IToolCall](index.md#itoolcall)
- [IToolParams](index.md#itoolparams)
- [IToolResult](index.md#itoolresult)
- [MCPBase](index.md#mcpbase)
- [MCPBaseConfig](index.md#mcpbaseconfig)
- [MCPClient](index.md#mcpclient)
- [MCPSelection](index.md#mcpselection)
- [MCPToolWrapper](index.md#mcptoolwrapper)
- [MCPTransport](index.md#mcptransport)
- [MapIn](index.md#mapin)
- [MapOut](index.md#mapout)
- [MatchCaseEnum](index.md#matchcaseenum)
- [Message](index.md#message)
- [MultiplexTraceSink](index.md#multiplextracesink)
- [OrchestrationState](index.md#orchestrationstate)
- [PromptBuilder](index.md#promptbuilder)
- [PromptBuilderConfig](index.md#promptbuilderconfig)
- [PromptMode](index.md#promptmode)
- [ProviderAdapter](index.md#provideradapter)
- [ProviderConfig](index.md#providerconfig)
- [ProviderInstance](index.md#providerinstance)
- [SAPParser](index.md#sapparser)
- [SearchModeEnum](index.md#searchmodeenum)
- [SearchTool](index.md#searchtool)
- [SearchTypeEnum](index.md#searchtypeenum)
- [SharedPatch](index.md#sharedpatch)
- [SharedState](index.md#sharedstate)
- [Step](index.md#step)
- [StepContext](index.md#stepcontext)
- [StepProviderOptions](index.md#stepprovideroptions)
- [StepResultUpdate](index.md#stepresultupdate)
- [StepsConfig](index.md#stepsconfig)
- [StepsDeps](index.md#stepsdeps)
- [StepsOrchestrator](index.md#stepsorchestrator)
- [SubflowPolicy](index.md#subflowpolicy)
- [TelemetryOptions](index.md#telemetryoptions)
- [TerminalTool](index.md#terminaltool)
- [ToDoIstParams](index.md#todoistparams)
- [ToDoIstTool](index.md#todoisttool)
- [TokenizerService](index.md#tokenizerservice)
- [ToolBase](index.md#toolbase)
- [ToolDetectionResult](index.md#tooldetectionresult)
- [ToolDetector](index.md#tooldetector)
- [ToolExecutor](index.md#toolexecutor)
- [ToolRouterKey](index.md#toolrouterkey)
- [ToolSchema](index.md#toolschema)
- [TraceContext](index.md#tracecontext)
- [TraceEvent](index.md#traceevent)
- [TraceEventType](index.md#traceeventtype)
- [TraceLevel](index.md#tracelevel)
- [TraceOrchestrator](index.md#traceorchestrator)
- [TraceSink](index.md#tracesink)
- [applySharedPatch](index.md#applysharedpatch)
- [cloneShared](index.md#cloneshared)
- [createAgentNode](index.md#createagentnode)
- [createHumanInLoopNode](index.md#createhumaninloopnode)
- [createReactValidationNode](index.md#createreactvalidationnode)
- [createRegisteredAgentNode](index.md#createregisteredagentnode)
- [createStepAgent](index.md#createstepagent)
- [createStepSubflow](index.md#createstepsubflow)
- [createSubflowNode](index.md#createsubflownode)
- [createToolDetectionNode](index.md#createtooldetectionnode)
- [createToolExecutorNode](index.md#createtoolexecutornode)
- [createToolRouter](index.md#createtoolrouter)
- [createTraceId](index.md#createtraceid)
- [emitTrace](index.md#emittrace)
- [formatIssuesForLLM](index.md#formatissuesforllm)
- [generateTypedSchema](index.md#generatetypedschema)
- [getActiveTelemetry](index.md#getactivetelemetry)
- [getProvider](index.md#getprovider)
- [listProviders](index.md#listproviders)
- [materializeTrace](index.md#materializetrace)
- [noopTraceSink](index.md#nooptracesink)
- [roocodeMcpConfig](index.md#roocodemcpconfig)
- [runWithTelemetry](index.md#runwithtelemetry)
- [stepAgent](index.md#stepagent)
- [stepAgentCustom](index.md#stepagentcustom)
- [stepFinalize](index.md#stepfinalize)
- [stream](index.md#stream)
- [toolRegistry](index.md#toolregistry)
- [validateAgentConfig](index.md#validateagentconfig)
- [validateToolParams](index.md#validatetoolparams)

## References

### AGENT\_MODES

Re-exports [AGENT_MODES](llmModes_modes.md#agent_modes)

___

### AgentExecutionOptions

Re-exports [AgentExecutionOptions](../interfaces/agent_interfaces_IAgent.AgentExecutionOptions.md)

___

### AgentExecutionResult

Re-exports [AgentExecutionResult](../interfaces/agent_interfaces_IAgent.AgentExecutionResult.md)

___

### AgentInfo

Re-exports [AgentInfo](../interfaces/promptBuilder_promptBuilder_interface.AgentInfo.md)

___

### AgentLLM

Re-exports [AgentLLM](../classes/agent_llm_agentLLM.AgentLLM.md)

___

### AgentLLMConfig

Re-exports [AgentLLMConfig](../interfaces/agent_interfaces_agentLLM_interface.AgentLLMConfig.md)

___

### AgentMode

Re-exports [AgentMode](llmModes_modes.md#agentmode)

___

### AgentModeType

Renames and re-exports [AgentMode](llmModes_modes.md#agentmode)

___

### AgentModeUtil

Renames and re-exports [AgentMode](../classes/llmModes_modes_modeRegistry.AgentMode.md)

___

### AgentRegistrationOptions

Re-exports [AgentRegistrationOptions](../interfaces/agent_interfaces_AgentRegistry_interface.AgentRegistrationOptions.md)

___

### AgentRegistry

Re-exports [AgentRegistry](../classes/agent_registry_AgentRegistry.AgentRegistry.md)

___

### AgentRegistryInfo

Re-exports [AgentRegistryInfo](../interfaces/agent_interfaces_AgentRegistry_interface.AgentRegistryInfo.md)

___

### AgentRegistryInstance

Re-exports [AgentRegistryInstance](agent_registry_AgentRegistry.md#agentregistryinstance)

___

### AgentRegistryStats

Re-exports [AgentRegistryStats](../interfaces/agent_interfaces_AgentRegistry_interface.AgentRegistryStats.md)

___

### AgentStepConfig

Re-exports [AgentStepConfig](../interfaces/orchestrators_steps_interfaces.AgentStepConfig.md)

___

### AgentType

Re-exports [AgentType](agent_interfaces_IAgentConfig.md#agenttype)

___

### ApprovalParams

Re-exports [ApprovalParams](../classes/tools_tools_approvalTool.ApprovalParams.md)

___

### ApprovalTool

Re-exports [ApprovalTool](../classes/tools_tools_approvalTool.ApprovalTool.md)

___

### AskUserParams

Re-exports [AskUserParams](../classes/tools_tools_askUserTool.AskUserParams.md)

___

### AskUserTool

Re-exports [AskUserTool](../classes/tools_tools_askUserTool.AskUserTool.md)

___

### CallFlowParams

Re-exports [CallFlowParams](../classes/tools_tools_callFlowParams.CallFlowParams.md)

___

### CallFlowTool

Re-exports [CallFlowTool](../classes/tools_tools_callFlowTool.CallFlowTool.md)

___

### ChatHistoryConfig

Re-exports [ChatHistoryConfig](../interfaces/memory_memory_interface.ChatHistoryConfig.md)

___

### ChatHistoryManager

Re-exports [ChatHistoryManager](../classes/memory_chatHistoryManager.ChatHistoryManager.md)

___

### ConditionalEdge

Re-exports [ConditionalEdge](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.ConditionalEdge.md)

___

### DEFAULT\_AGENT\_CONFIG

Re-exports [DEFAULT_AGENT_CONFIG](agent_interfaces_IAgentConfig.md#default_agent_config)

___

### DEFAULT\_TELEMETRY\_OPTIONS

Re-exports [DEFAULT_TELEMETRY_OPTIONS](telemetry_interfaces_telemetryOptions_interface.md#default_telemetry_options)

___

### ExecuteOptions

Re-exports [ExecuteOptions](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.ExecuteOptions.md)

___

### FileCreateTool

Re-exports [FileCreateTool](tools_tools_fileCreateTool.md#filecreatetool)

___

### FileEditTool

Re-exports [FileEditTool](tools_tools_fileEditTool.md#fileedittool)

___

### FileReadTool

Re-exports [FileReadTool](tools_tools_fileReadTool.md#filereadtool)

___

### FinalAnswerParams

Re-exports [FinalAnswerParams](../classes/tools_tools_finalAnswerTool.FinalAnswerParams.md)

___

### FinalAnswerTool

Re-exports [FinalAnswerTool](../classes/tools_tools_finalAnswerTool.FinalAnswerTool.md)

___

### FlowDefinition

Re-exports [FlowDefinition](../interfaces/flows_interfaces_flowDefinition_interface.FlowDefinition.md)

___

### FlowKind

Re-exports [FlowKind](flows_interfaces_flowDefinition_interface.md#flowkind)

___

### FlowRegistry

Re-exports [FlowRegistry](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md)

___

### FlowRegistryImpl

Re-exports [FlowRegistryImpl](../classes/flows_registry_flowRegistryImpl.FlowRegistryImpl.md)

___

### FlowRunner

Re-exports [FlowRunner](../interfaces/flows_interfaces_flowRunner_interface.FlowRunner.md)

___

### FlowRunnerImpl

Re-exports [FlowRunnerImpl](../classes/flows_runner_flowRunnerImpl.FlowRunnerImpl.md)

___

### GraphBuilder

Re-exports [GraphBuilder](../classes/orchestrators_graph_builder_GraphBuilder.GraphBuilder.md)

___

### GraphBuilderOptions

Re-exports [GraphBuilderOptions](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.GraphBuilderOptions.md)

___

### GraphDefinition

Re-exports [GraphDefinition](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

___

### GraphEngine

Re-exports [GraphEngine](../classes/orchestrators_graph_core_GraphEngine.GraphEngine.md)

___

### GraphNode

Re-exports [GraphNode](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md)

___

### GraphNodeControl

Re-exports [GraphNodeControl](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeControl.md)

___

### GraphNodeResult

Re-exports [GraphNodeResult](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md)

___

### GraphRunResult

Re-exports [GraphRunResult](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphRunResult.md)

___

### GraphStatus

Re-exports [GraphStatus](../enums/orchestrators_graph_core_enums_graphEngine_enum.GraphStatus.md)

___

### IAgent

Re-exports [IAgent](../interfaces/agent_interfaces_IAgent.IAgent.md)

___

### IAgentConfig

Re-exports [IAgentConfig](../interfaces/agent_interfaces_IAgentConfig.IAgentConfig.md)

___

### IAgentRegistry

Re-exports [IAgentRegistry](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md)

___

### IChatHistoryManager

Re-exports [IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md)

___

### IGraphBuilder

Re-exports [IGraphBuilder](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md)

___

### IGraphState

Re-exports [IGraphState](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)

___

### IProviderResponse

Re-exports [IProviderResponse](../interfaces/providers_adapter_providerAdapter_interface.IProviderResponse.md)

___

### ISAPError

Re-exports [ISAPError](../interfaces/tools_constructor_sapParser.ISAPError.md)

___

### IStepsOrchestrator

Re-exports [IStepsOrchestrator](../interfaces/orchestrators_steps_interfaces.IStepsOrchestrator.md)

___

### ITokenizerService

Re-exports [ITokenizerService](../interfaces/memory_memory_interface.ITokenizerService.md)

___

### ITool

Re-exports [ITool](../interfaces/tools_core_interfaces.ITool.md)

___

### IToolCall

Re-exports [IToolCall](../interfaces/tools_core_interfaces.IToolCall.md)

___

### IToolParams

Re-exports [IToolParams](../interfaces/tools_core_interfaces.IToolParams.md)

___

### IToolResult

Re-exports [IToolResult](../interfaces/tools_core_interfaces.IToolResult.md)

___

### MCPBase

Re-exports [MCPBase](../classes/tools_tools_mcp_MCPBase.MCPBase.md)

___

### MCPBaseConfig

Re-exports [MCPBaseConfig](../interfaces/tools_tools_mcp_MCPBase.MCPBaseConfig.md)

___

### MCPClient

Re-exports [MCPClient](../classes/tools_tools_mcp_MCPClient.MCPClient.md)

___

### MCPSelection

Re-exports [MCPSelection](../interfaces/tools_tools_mcp_MCPBase.MCPSelection.md)

___

### MCPToolWrapper

Re-exports [MCPToolWrapper](../classes/tools_tools_mcp_MCPToolWrapper.MCPToolWrapper.md)

___

### MCPTransport

Re-exports [MCPTransport](tools_tools_mcp_MCPClient.md#mcptransport)

___

### MapIn

Re-exports [MapIn](flows_interfaces_mapInOut_interface.md#mapin)

___

### MapOut

Re-exports [MapOut](flows_interfaces_mapInOut_interface.md#mapout)

___

### MatchCaseEnum

Re-exports [MatchCaseEnum](../enums/tools_tools_searchTool.MatchCaseEnum.md)

___

### Message

Re-exports [Message](../interfaces/memory_memory_interface.Message.md)

___

### MultiplexTraceSink

Re-exports [MultiplexTraceSink](../classes/telemetry_sinks_multiplexTraceSink.MultiplexTraceSink.md)

___

### OrchestrationState

Re-exports [OrchestrationState](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md)

___

### PromptBuilder

Re-exports [PromptBuilder](../classes/promptBuilder_promptBuilder.PromptBuilder.md)

___

### PromptBuilderConfig

Re-exports [PromptBuilderConfig](../interfaces/promptBuilder_promptBuilder_interface.PromptBuilderConfig.md)

___

### PromptMode

Re-exports [PromptMode](promptBuilder_promptBuilder_interface.md#promptmode)

___

### ProviderAdapter

Re-exports [ProviderAdapter](../classes/providers_adapter_providerAdapter.ProviderAdapter.md)

___

### ProviderConfig

Re-exports [ProviderConfig](../interfaces/providers_adapter_providerAdapter_interface.ProviderConfig.md)

___

### ProviderInstance

Re-exports [ProviderInstance](../interfaces/providers_providers_providerRegistry.ProviderInstance.md)

___

### SAPParser

Re-exports [SAPParser](../classes/tools_constructor_sapParser.SAPParser.md)

___

### SearchModeEnum

Re-exports [SearchModeEnum](../enums/tools_tools_searchTool.SearchModeEnum.md)

___

### SearchTool

Re-exports [SearchTool](tools_tools_searchTool.md#searchtool)

___

### SearchTypeEnum

Re-exports [SearchTypeEnum](../enums/tools_tools_searchTool.SearchTypeEnum.md)

___

### SharedPatch

Re-exports [SharedPatch](../interfaces/flows_interfaces_sharedPatch_interface.SharedPatch.md)

___

### SharedState

Re-exports [SharedState](../interfaces/flows_interfaces_sharedState_interface.SharedState.md)

___

### Step

Re-exports [Step](../interfaces/orchestrators_steps_interfaces.Step.md)

___

### StepContext

Re-exports [StepContext](../interfaces/orchestrators_steps_interfaces.StepContext.md)

___

### StepProviderOptions

Re-exports [StepProviderOptions](../interfaces/orchestrators_steps_interfaces.StepProviderOptions.md)

___

### StepResultUpdate

Re-exports [StepResultUpdate](../interfaces/orchestrators_steps_interfaces.StepResultUpdate.md)

___

### StepsConfig

Re-exports [StepsConfig](../interfaces/orchestrators_steps_interfaces.StepsConfig.md)

___

### StepsDeps

Re-exports [StepsDeps](../interfaces/orchestrators_steps_interfaces.StepsDeps.md)

___

### StepsOrchestrator

Re-exports [StepsOrchestrator](../classes/orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md)

___

### SubflowPolicy

Re-exports [SubflowPolicy](../interfaces/flows_interfaces_subflowPolicy_interface.SubflowPolicy.md)

___

### TelemetryOptions

Re-exports [TelemetryOptions](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md)

___

### TerminalTool

Re-exports [TerminalTool](tools_tools_terminalTool.md#terminaltool)

___

### ToDoIstParams

Re-exports [ToDoIstParams](../classes/tools_tools_toDoIstTool.ToDoIstParams.md)

___

### ToDoIstTool

Re-exports [ToDoIstTool](../classes/tools_tools_toDoIstTool.ToDoIstTool.md)

___

### TokenizerService

Re-exports [TokenizerService](../classes/memory_tokenizer.TokenizerService.md)

___

### ToolBase

Re-exports [ToolBase](../classes/tools_constructor_toolBase.ToolBase.md)

___

### ToolDetectionResult

Re-exports [ToolDetectionResult](../interfaces/tools_core_toolDetector.ToolDetectionResult.md)

___

### ToolDetector

Re-exports [ToolDetector](../classes/tools_core_toolDetector.ToolDetector.md)

___

### ToolExecutor

Re-exports [ToolExecutor](../classes/tools_core_toolExecutor.ToolExecutor.md)

___

### ToolRouterKey

Re-exports [ToolRouterKey](../enums/orchestrators_graph_routing_enums_toolRouter_enum.ToolRouterKey.md)

___

### ToolSchema

Re-exports [ToolSchema](promptBuilder_promptBuilder_interface.md#toolschema)

___

### TraceContext

Re-exports [TraceContext](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md)

___

### TraceEvent

Re-exports [TraceEvent](../interfaces/telemetry_interfaces_traceEvent_interface.TraceEvent.md)

___

### TraceEventType

Re-exports [TraceEventType](telemetry_interfaces_traceEventType_interface.md#traceeventtype)

___

### TraceLevel

Re-exports [TraceLevel](telemetry_interfaces_traceEvent_interface.md#tracelevel)

___

### TraceOrchestrator

Re-exports [TraceOrchestrator](telemetry_interfaces_traceEvent_interface.md#traceorchestrator)

___

### TraceSink

Re-exports [TraceSink](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md)

___

### applySharedPatch

Re-exports [applySharedPatch](flows_utils_sharedPatchApplier.md#applysharedpatch)

___

### cloneShared

Re-exports [cloneShared](flows_utils_sharedClone.md#cloneshared)

___

### createAgentNode

Re-exports [createAgentNode](orchestrators_graph_nodes_agentNode.md#createagentnode)

___

### createHumanInLoopNode

Re-exports [createHumanInLoopNode](orchestrators_graph_nodes_humanInLoopNode.md#createhumaninloopnode)

___

### createReactValidationNode

Re-exports [createReactValidationNode](orchestrators_graph_nodes_reactValidationNode.md#createreactvalidationnode)

___

### createRegisteredAgentNode

Re-exports [createRegisteredAgentNode](orchestrators_graph_nodes_registeredAgentNode.md#createregisteredagentnode)

___

### createStepAgent

Re-exports [createStepAgent](orchestrators_steps_steps.md#createstepagent)

___

### createStepSubflow

Re-exports [createStepSubflow](orchestrators_steps_steps.md#createstepsubflow)

___

### createSubflowNode

Re-exports [createSubflowNode](orchestrators_graph_nodes_subflowNode.md#createsubflownode)

___

### createToolDetectionNode

Re-exports [createToolDetectionNode](orchestrators_graph_nodes_toolDetectionNode.md#createtooldetectionnode)

___

### createToolExecutorNode

Re-exports [createToolExecutorNode](orchestrators_graph_nodes_toolExecutorNode.md#createtoolexecutornode)

___

### createToolRouter

Re-exports [createToolRouter](orchestrators_graph_routing_toolRouter.md#createtoolrouter)

___

### createTraceId

Re-exports [createTraceId](telemetry_utils_id.md#createtraceid)

___

### emitTrace

Re-exports [emitTrace](telemetry_utils_traceEmitter.md#emittrace)

___

### formatIssuesForLLM

Re-exports [formatIssuesForLLM](tools_core_toolValidator.md#formatissuesforllm)

___

### generateTypedSchema

Re-exports [generateTypedSchema](tools_constructor_schemaGenerator.md#generatetypedschema)

___

### getActiveTelemetry

Re-exports [getActiveTelemetry](telemetry_context_telemetryStore.md#getactivetelemetry)

___

### getProvider

Re-exports [getProvider](providers_providers.md#getprovider)

___

### listProviders

Re-exports [listProviders](providers_providers.md#listproviders)

___

### materializeTrace

Re-exports [materializeTrace](telemetry_utils_traceEmitter.md#materializetrace)

___

### noopTraceSink

Re-exports [noopTraceSink](telemetry_sinks_noopTraceSink.md#nooptracesink)

___

### roocodeMcpConfig

Re-exports [roocodeMcpConfig](tools_tools_mcp_roocode_mcp_config.md#roocodemcpconfig)

___

### runWithTelemetry

Re-exports [runWithTelemetry](telemetry_context_telemetryStore.md#runwithtelemetry)

___

### stepAgent

Re-exports [stepAgent](orchestrators_steps_steps.md#stepagent)

___

### stepAgentCustom

Re-exports [stepAgentCustom](orchestrators_steps_steps.md#stepagentcustom)

___

### stepFinalize

Re-exports [stepFinalize](orchestrators_steps_steps.md#stepfinalize)

___

### stream

Re-exports [stream](providers_utils_stream.md#stream)

___

### toolRegistry

Re-exports [toolRegistry](tools_core_toolRegistry.md#toolregistry)

___

### validateAgentConfig

Re-exports [validateAgentConfig](agent_interfaces_IAgentConfig.md#validateagentconfig)

___

### validateToolParams

Re-exports [validateToolParams](tools_core_toolValidator.md#validatetoolparams)

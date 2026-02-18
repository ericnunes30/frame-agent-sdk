// src/tools/sapParser.ts

import { toolRegistry } from '@/tools/core/toolRegistry';
import { IToolCall, ToolValidationIssue } from '@/tools/core/interfaces';
import { validateToolParams, formatIssuesForLLM } from '@/tools/core/toolValidator';

// DefiniÃ§Ã£o da estrutura de erro do SAP
export interface ISAPError {
    message: string;
    rawOutput: string;
    issues?: ToolValidationIssue[];
    llmHint?: string;
    suppressRepetition?: boolean;
}

/**
 * O Engine SAP (Schema Aligned Parsing).
 * ResponsÃ¡vel pela ValidaÃ§Ã£o, CorreÃ§Ã£o e Parsing da saÃ­da bruta do LLM
 * para o formato tipado IToolCall.
 */
export class SAPParser {
    // Aceita 'Action' e variações pt-BR ('Ação', 'Acao'), case-insensitive
    // Suporta nomes de ferramentas MCP com : e / (ex: mcp:context7/resolve-library-id)
    private static readonly ACTION_HEADER = /(Action|Ação|Acao)\s*:\s*([A-Za-z0-9_:\/-]+)\s*[:=]?\s*\{/i;

    private static stripCodeFences(text: string): string {
        return text.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ''))
            .replace(/`+/g, '');
    }

    /**
     * Converte o formato ReAct com "Action Input" para o formato SAP esperado.
     *
     * Converte:
     * Action: toolName
     * Action Input: { ... }
     *
     * Para:
     * Action: toolName = { ... }
     */
    private static convertActionInputFormat(text: string): string {
        const actionLine = text.match(/(Action|AÃ§Ã£o|Acao)\s*:\s*([A-Za-z0-9_:\/-]+)\s*(?:\r?\n|$)/i);
        if (!actionLine || actionLine.index === undefined) return text;

        const toolName = actionLine[2];
        const afterAction = text.slice(actionLine.index + actionLine[0].length);
        const inputHeader = afterAction.match(/Action Input\s*:\s*/i);
        if (!inputHeader || inputHeader.index === undefined) return text;

        const inputStart = actionLine.index + actionLine[0].length + inputHeader.index + inputHeader[0].length;
        const braceStart = text.indexOf('{', inputStart);
        if (braceStart < 0) return text;

        const rawJson = this.extractBalancedJson(text, braceStart);
        if (!rawJson) return text;

        const before = text.slice(0, actionLine.index);
        const after = text.slice(braceStart + rawJson.length);
        return `${before}Action: ${toolName} = ${rawJson}${after}`;
    }

    /**
     * Corrige formatação comum de saída do LLM para o padrão esperado
     * Converte: "Action: tool {" -> "Action: tool = {"
     *          "Action: tool: {" -> "Action: tool = {"
     */
    private static correctActionHeader(text: string): string {
        return text.replace(
            /(Action|Ação|Acao)\s*:\s*([A-Za-z0-9_:\/-]+)\s*[:=]?\s*\{/gi,
            '$1: $2 = {'
        );
    }

    private static extractBalancedJson(text: string, startIndex: number): string | null {
        let depth = 0;
        for (let i = startIndex; i < text.length; i++) {
            const ch = text[i];
            if (ch === '{') depth++;
            if (ch === '}') {
                depth--;
                if (depth === 0) {
                    return text.slice(startIndex, i + 1);
                }
            }
        }
        return null;
    }

    public static parseAndValidate(rawLLMOutput: string): IToolCall | ISAPError {
        let normalized = this.stripCodeFences(rawLLMOutput || '');
        normalized = this.convertActionInputFormat(normalized);
        normalized = this.correctActionHeader(normalized);

        const actionMatches = [...normalized.matchAll(/(?:^|\r?\n)\s*(?:Action|AÃ§Ã£o|Acao)\s*:\s*([A-Za-z0-9_:\/-]+)/gi)];
        if (actionMatches.length > 1) {
            const actionNames = actionMatches
                .map((m) => (m[1] || '').trim())
                .filter((name) => name.length > 0);
            const allTodoIst = actionNames.length > 0 && actionNames.every((name) => name === 'toDoIst');
            return {
                message: allTodoIst
                    ? 'Error: The `toDoIst` tool should never be called multiple times in parallel. Please call it only once per model invocation to update the plan.'
                    : 'Only one tool action is allowed per model invocation. Split multiple actions across turns.',
                rawOutput: rawLLMOutput,
                llmHint: 'Use exactly one Action per response.',
                suppressRepetition: true,
            } as ISAPError;
        }

        // Fallback: mapear "Final: ..." para final_answer
        const finalMatch = normalized.match(/Final\s*:\s*([\s\S]+)/i);
        if (finalMatch && finalMatch[1]) {
            return { toolName: 'final_answer', params: { answer: finalMatch[1].trim() } } as IToolCall;
        }

        const header = normalized.match(this.ACTION_HEADER);
        if (!header) {
            return {
                message: "Não foi possível extrair uma chamada de ferramenta (esperado: 'Action: toolName = {...}').",
                rawOutput: rawLLMOutput,
                llmHint: "Use: Action: <toolName> = { ... } (ou Action: <toolName>\\nAction Input: { ... }) com JSON válido.",
            } as ISAPError;
        }

        const toolName = header[2];
        const braceStart = normalized.indexOf('{', header.index!);
        const rawJsonParams = braceStart >= 0 ? this.extractBalancedJson(normalized, braceStart) : null;
        if (!rawJsonParams) {
            return {
                message: `Erro de Parsing: JSON não balanceado para a ferramenta '${toolName}'.`,
                rawOutput: rawLLMOutput,
                llmHint: "Provide a complete JSON object after '=' with matching braces.",
            } as ISAPError;
        }

        const toolInstance = toolRegistry.getTool(toolName);
        if (!toolInstance) {
            return {
                message: `Erro de Validação: A ferramenta '${toolName}' não está registrada.`,
                rawOutput: rawLLMOutput,
            } as ISAPError;
        }

        let parsedParams: unknown;
        try {
            parsedParams = JSON.parse(rawJsonParams);
        } catch {
            const fixed = rawJsonParams
                .replace(/'([A-Za-z0-9_]+)'(?=\s*:)/g, '"$1"')
                .replace(/:\s*'([^']*)'/g, ':"$1"');
            try {
                parsedParams = JSON.parse(fixed);
            } catch {
                return {
                    message: `Erro de Parsing/Validação: JSON inválido para '${toolName}'.`,
                    rawOutput: rawLLMOutput,
                } as ISAPError;
            }
            // Adiciona flag para evitar repetição de erros já corrigidos
            return {
                message: `Erro de Parsing/Validação: JSON inválido para '${toolName}'.`,
                rawOutput: rawLLMOutput,
                suppressRepetition: true
            } as ISAPError;
        }

        const result = validateToolParams(toolInstance, parsedParams);
        if (!result.valid) {
            return {
                message: `Erro de Validação: Parâmetros inválidos para a ferramenta '${toolName}'.`,
                rawOutput: rawLLMOutput,
                issues: result.issues,
                llmHint: result.issues ? formatIssuesForLLM(result.issues) : undefined,
                suppressRepetition: true
            } as ISAPError;
        }

        return { toolName, params: parsedParams as Record<string, unknown> } as IToolCall;
    }
}

/**
 * Parser SAP (Schema Aligned Parsing):
 * Responsável por extrair a chamada de ferramenta do texto em formato
 * 'Action: <tool> = { ... }' e validar sua estrutura básica.
 */

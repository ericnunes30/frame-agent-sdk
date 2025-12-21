export interface ValidationError {
  message: string;
  type: 'format' | 'missing_thought' | 'missing_action' | 'invalid_json' | 'other';
  details?: any;
}

export interface ValidationResponse {
  isValid: boolean;
  error?: ValidationError;
}

/**
 * Valida se o output do LLM segue o formato ReAct correto do SAP (Schema Aligned Parsing)
 *
 * Formatos aceitos:
 * Thought: [pensamento do modelo]
 * Action: [nome_da_ferramenta] = { [JSON com parÃ¢metros] }
 *
 * ou:
 * Thought: [pensamento do modelo]
 * Action: [nome_da_ferramenta]
 * Action Input: { [JSON com parÃ¢metros] }
 *
 * @param output - Texto gerado pelo LLM para validaÃ§Ã£o
 * @returns Objeto com resultado da validaÃ§Ã£o
 */
export function validateReActFormat(output: string): ValidationResponse {
  if (!output || output.trim().length === 0) {
    return {
      isValid: false,
      error: {
        message: 'Output vazio ou invÃ¡lido',
        type: 'format'
      }
    };
  }

  const hasThought = output.includes('Thought:');
  const hasAction = output.includes('Action:');

  if (!hasThought) {
    return {
      isValid: false,
      error: {
        message: 'SeÃ§Ã£o "Thought:" nÃ£o encontrada. Por favor, inclua seu pensamento antes da aÃ§Ã£o.',
        type: 'missing_thought'
      }
    };
  }

  if (!hasAction) {
    return {
      isValid: false,
      error: {
        message: 'SeÃ§Ã£o "Action:" nÃ£o encontrada. Por favor, especifique a aÃ§Ã£o a ser executada.',
        type: 'missing_action'
      }
    };
  }

  const directMatch = output.match(/Action:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*({[\s\S]*?})(?:\r?\n|$)/);

  let jsonParams: string | null = null;
  if (directMatch) {
    jsonParams = directMatch[2];
  } else {
    const actionLine = output.match(/Action:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:\r?\n|$)/);
    if (!actionLine || actionLine.index === undefined) {
      return invalidActionFormat();
    }

    const afterAction = output.slice(actionLine.index + actionLine[0].length);
    const inputHeader = afterAction.match(/Action Input\s*:\s*/i);
    if (!inputHeader || inputHeader.index === undefined) {
      return invalidActionFormat();
    }

    const inputStart = actionLine.index + actionLine[0].length + inputHeader.index + inputHeader[0].length;
    const braceStart = output.indexOf('{', inputStart);
    if (braceStart < 0) {
      return {
        isValid: false,
        error: {
          message: 'Action Input nÃ£o contÃ©m um objeto JSON (esperado: { ... }).',
          type: 'format'
        }
      };
    }

    jsonParams = extractBalancedJson(output, braceStart);
    if (!jsonParams) {
      return {
        isValid: false,
        error: {
          message: 'ParÃ¢metros da Action nÃ£o estÃ£o balanceados (chaves { } incompletas).',
          type: 'invalid_json'
        }
      };
    }
  }

  if (jsonParams) {
    try {
      JSON.parse(jsonParams.trim());
    } catch {
      return {
        isValid: false,
        error: {
          message: 'ParÃ¢metros da Action nÃ£o estÃ£o em formato JSON vÃ¡lido. Por favor, verifique a formataÃ§Ã£o.',
          type: 'invalid_json'
        }
      };
    }
  }

  return { isValid: true };
}

function invalidActionFormat(): ValidationResponse {
  return {
    isValid: false,
    error: {
      message: 'Formato de Action invÃ¡lido. Use: Action: <toolName> = { ... } ou Action: <toolName> + Action Input: { ... }',
      type: 'format'
    }
  };
}

function extractBalancedJson(text: string, startIndex: number): string | null {
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


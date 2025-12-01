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
 * Formato esperado:
 * Thought: [pensamento do modelo]
 * Action: [nome_da_ferramenta] = { [JSON com parâmetros] }
 * 
 * @param output - Texto gerado pelo LLM para validação
 * @returns Objeto com resultado da validação
 */
export function validateReActFormat(output: string): ValidationResponse {
  // Verificar se o output está vazio
  if (!output || output.trim().length === 0) {
    return {
      isValid: false,
      error: {
        message: 'Output vazio ou inválido',
        type: 'format'
      }
    };
  }

  // Verificar se contém as seções obrigatórias
  const hasThought = output.includes('Thought:');
  const hasAction = output.includes('Action:');

  if (!hasThought) {
    return {
      isValid: false,
      error: {
        message: 'Seção "Thought:" não encontrada. Por favor, inclua seu pensamento antes da ação.',
        type: 'missing_thought'
      }
    };
  }

  if (!hasAction) {
    return {
      isValid: false,
      error: {
        message: 'Seção "Action:" não encontrada. Por favor, especifique a ação a ser executada.',
        type: 'missing_action'
      }
    };
  }

  // Verificar se Action tem o formato correto com parâmetros em JSON
  const actionMatch = output.match(/Action:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*({[\s\S]*?})(?:\n|$)/);
  if (!actionMatch) {
    return {
      isValid: false,
      error: {
        message: 'Formato de Action inválido. Use: Action: <toolName> = { "param": value }',
        type: 'format'
      }
    };
  }

  // Verificar se o JSON de parâmetros é válido
  const jsonParams = actionMatch[2];
  if (jsonParams) {
    try {
      JSON.parse(jsonParams.trim());
    } catch (e) {
      return {
        isValid: false,
        error: {
          message: 'Parâmetros da Action não estão em formato JSON válido. Por favor, verifique a formatação.',
          type: 'invalid_json'
        }
      };
    }
  }

  // Se todas as validações passaram
  return {
    isValid: true
  };
}
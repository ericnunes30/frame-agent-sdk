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
 * Validates whether the LLM output follows the expected ReAct format.
 *
 * Accepted formats:
 * Thought: [model reasoning]
 * Action: [tool_name] = { [JSON params] }
 *
 * or:
 * Thought: [model reasoning]
 * Action: [tool_name]
 * Action Input: { [JSON params] }
 *
 * @param output - LLM-generated text to validate
 * @returns Validation result object
 */
export function validateReActFormat(output: string): ValidationResponse {
  if (!output || output.trim().length === 0) {
    return {
      isValid: false,
      error: {
        message: 'Empty or invalid output.',
        type: 'format'
      }
    };
  }

  // NOTE: Temporary debug logs removed; use logger.debug() when needed.

  const hasThought = output.includes('Thought:');
  const hasAction = output.includes('Action:');

  if (!hasThought) {
    return {
      isValid: false,
      error: {
        message: 'Missing "Thought:" section. Please include your reasoning before the action.',
        type: 'missing_thought'
      }
    };
  }

  if (!hasAction) {
    return {
      isValid: false,
      error: {
        message: 'Missing "Action:" section. Please specify the action to execute.',
        type: 'missing_action'
      }
    };
  }

  const directMatch = output.match(/Action:\s*([a-zA-Z_][a-zA-Z0-9_:/]*)\s*=\s*({[\s\S]*?})\s*(?:\r?\n|$)/);

  let jsonParams: string | null = null;
  if (directMatch) {
    jsonParams = directMatch[2];
  } else {
    const actionLine = output.match(/Action:\s*([a-zA-Z_][a-zA-Z0-9_:/]*)\s*(?:\r?\n|$)/);
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
          message: 'Action Input does not contain a JSON object (expected: { ... }).',
          type: 'format'
        }
      };
    }

    jsonParams = extractBalancedJson(output, braceStart);
    if (!jsonParams) {
      return {
        isValid: false,
        error: {
          message: 'Action parameters are not balanced (incomplete { } braces).',
          type: 'invalid_json'
        }
      };
    }
  }

  if (jsonParams) {
    try {
      JSON.parse(jsonParams.trim());
    } catch (e) {
      return {
        isValid: false,
        error: {
          message: 'Action parameters are not valid JSON. Please check the formatting.',
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
      message: 'Invalid Action format. Use: Action: <toolName> = { ... } or Action: <toolName> + Action Input: { ... }',
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


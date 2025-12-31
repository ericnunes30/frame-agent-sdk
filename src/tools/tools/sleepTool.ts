import { ToolBase } from '@/tools/constructor/toolBase';
import { IToolParams } from '@/tools/core/interfaces';

/**
 * Parâmetros para a ferramenta sleep
 */
interface ISleepParams extends IToolParams {
  /** Tempo de espera em milissegundos (min: 1, max: 60000) */
  duration: number;
}

/**
 * Mensagens de erro padronizadas
 */
enum SleepErrorMessages {
  DURATION_REQUIRED = 'Duração é obrigatória',
  DURATION_INVALID = 'Duração deve ser um número positivo',
  DURATION_TOO_SMALL = 'Duração deve ser pelo menos 1ms',
  DURATION_TOO_LARGE = 'Duração não pode exceder 60000ms (60 segundos)',
}

/**
 * Resultado da operação sleep
 */
interface ISleepResult {
  success: boolean;
  message?: string;
  duration?: number;
}

/**
 * Classe de validação dos parâmetros sleep
 */
class SleepParams {
  static schemaProperties = {
    duration: { type: 'number', required: true }
  } as const;

  static validate(params: any): { isValid: boolean; error?: string } {
    if (params.duration === undefined || params.duration === null) {
      return {
        isValid: false,
        error: SleepErrorMessages.DURATION_REQUIRED
      };
    }

    if (typeof params.duration !== 'number') {
      return {
        isValid: false,
        error: SleepErrorMessages.DURATION_INVALID
      };
    }

    if (params.duration < 1) {
      return {
        isValid: false,
        error: SleepErrorMessages.DURATION_TOO_SMALL
      };
    }

    if (params.duration > 60000) {
      return {
        isValid: false,
        error: SleepErrorMessages.DURATION_TOO_LARGE
      };
    }

    return { isValid: true };
  }
}

/**
 * Ferramenta para pausar a execução do agente por um período especificado.
 * 
 * Esta ferramenta é útil para:
 * - Aguardar que processos em background completem
 * - Criar delays entre operações
 * - Evitar spam de requisições ao LLM
 * 
 * ## Uso Recomendado
 * 
 * ```typescript
 * // Pausar por 2 segundos
 * await sleepTool.execute({ duration: 2000 });
 * 
 * // Pausar por 5 segundos
 * await sleepTool.execute({ duration: 5000 });
 * ```
 * 
 * ## Limitações
 * 
 * - Duração mínima: 1ms
 * - Duração máxima: 60000ms (60 segundos)
 * 
 * @example
 * ```typescript
 * // Criar processo em background
 * await terminalTool.execute({
 *   action: 'create',
 *   command: 'npm run dev',
 *   background: true
 * });
 * 
 * // Aguardar 5 segundos para o servidor iniciar
 * await sleepTool.execute({ duration: 5000 });
 * 
 * // Verificar status do processo
 * await terminalTool.execute({
 *   action: 'status',
 *   sessionId: '...'
 * });
 * ```
 */
export const SleepTool = new class extends ToolBase<ISleepParams, ISleepResult> {
  public readonly name = 'sleep';
  public readonly description = `Pausa a execução do agente por um período especificado em milissegundos.

## Parâmetros
- duration: (obrigatório) tempo de espera em ms (min: 1, max: 60000)

## Uso Recomendado
1. Use após criar processos em background para aguardar inicialização
2. Use entre operações para evitar spam de requisições
3. Use para criar delays necessários em workflows

## Exemplo
- Pausar por 2 segundos: { "duration": 2000 }
- Pausar por 5 segundos: { "duration": 5000 }
- Pausar por 10 segundos: { "duration": 10000 }

## Limitações
- Duração mínima: 1ms
- Duração máxima: 60000ms (60 segundos)`;
  public readonly parameterSchema = SleepParams;

  public async execute(params: ISleepParams): Promise<ISleepResult> {
    // Validar parâmetros
    const validation = SleepParams.validate(params);
    if (!validation.isValid) {
      return { success: false, message: validation.error };
    }

    const { duration } = params;

    // Pausar a execução pelo tempo especificado
    await new Promise(resolve => setTimeout(resolve, duration));

    return {
      success: true,
      message: `Execução pausada por ${duration}ms`,
      duration
    };
  }
}();

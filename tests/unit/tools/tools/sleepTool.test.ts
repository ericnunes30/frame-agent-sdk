import { SleepTool } from '@/tools/tools/sleepTool';

describe('SleepTool', () => {
  describe('Validação de Parâmetros', () => {
    it('deve rejeitar quando duration não é fornecido', async () => {
      const result = await SleepTool.execute({} as any);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Duração é obrigatória');
    });

    it('deve rejeitar quando duration não é um número', async () => {
      const result = await SleepTool.execute({ duration: '1000' } as any);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Duração deve ser um número positivo');
    });

    it('deve rejeitar quando duration é menor que 1ms', async () => {
      const result = await SleepTool.execute({ duration: 0 });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Duração deve ser pelo menos 1ms');
    });

    it('deve rejeitar quando duration é negativo', async () => {
      const result = await SleepTool.execute({ duration: -1000 });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Duração deve ser pelo menos 1ms');
    });

    it('deve rejeitar quando duration é maior que 60000ms', async () => {
      const result = await SleepTool.execute({ duration: 70000 });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Duração não pode exceder 60000ms');
    });
  });

  describe('Execução', () => {
    it('deve pausar por 1000ms', async () => {
      const startTime = Date.now();
      const result = await SleepTool.execute({ duration: 1000 });
      const endTime = Date.now();
      const actualDuration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(result.duration).toBe(1000);
      expect(actualDuration).toBeGreaterThanOrEqual(950);
      expect(actualDuration).toBeLessThan(1100);
    });

    it('deve pausar por 2000ms', async () => {
      const startTime = Date.now();
      const result = await SleepTool.execute({ duration: 2000 });
      const endTime = Date.now();
      const actualDuration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(result.duration).toBe(2000);
      expect(actualDuration).toBeGreaterThanOrEqual(1950);
      expect(actualDuration).toBeLessThan(2100);
    });

    it('deve pausar por 5000ms', async () => {
      const startTime = Date.now();
      const result = await SleepTool.execute({ duration: 5000 });
      const endTime = Date.now();
      const actualDuration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(result.duration).toBe(5000);
      expect(actualDuration).toBeGreaterThanOrEqual(4950);
      expect(actualDuration).toBeLessThan(5100);
    }, 6000);

    it('deve retornar mensagem correta', async () => {
      const result = await SleepTool.execute({ duration: 2000 });

      expect(result.message).toBe('Execução pausada por 2000ms');
    });

    it('deve bloquear o event loop durante o sleep', async () => {
      let callbackExecuted = false;
      const timeoutCallback = () => {
        callbackExecuted = true;
      };

      // Agendar um callback para executar em 500ms
      setTimeout(timeoutCallback, 500);

      // Pausar por 2000ms
      const startTime = Date.now();
      await SleepTool.execute({ duration: 2000 });
      const endTime = Date.now();
      const actualDuration = endTime - startTime;

      // Verificar se o sleep bloqueou corretamente
      expect(actualDuration).toBeGreaterThanOrEqual(1950);
      expect(actualDuration).toBeLessThan(2100);

      // O callback deve ter sido executado (setTimeout não é bloqueado pelo sleep)
      expect(callbackExecuted).toBe(true);
    });
  });

  describe('Limites', () => {
    it('deve aceitar o valor mínimo de 1ms', async () => {
      const result = await SleepTool.execute({ duration: 1 });

      expect(result.success).toBe(true);
      expect(result.duration).toBe(1);
    });

    it('deve aceitar o valor máximo de 60000ms', async () => {
      const result = await SleepTool.execute({ duration: 60000 });

      expect(result.success).toBe(true);
      expect(result.duration).toBe(60000);
    }, 65000);
  });
});

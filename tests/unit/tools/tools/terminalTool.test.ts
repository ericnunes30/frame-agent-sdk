import { TerminalTool } from '@/tools/tools/terminalTool';
import { randomUUID } from 'crypto';

describe('TerminalTool', () => {
  describe('Status Behavior (sem timeout)', () => {
    it('deve retornar status imediatamente sem esperar', async () => {
      const sessionId = randomUUID();
      
      // Criar um processo de longa duração
      const createResult = await TerminalTool.execute({
        action: 'create',
        command: process.platform === 'win32' ? 'ping -n 10 127.0.0.1' : 'sleep 10',
        background: true,
        sessionId
      });

      expect(createResult.success).toBe(true);

      // Verificar que o status retorna imediatamente
      const startTime = Date.now();
      const statusResult = await TerminalTool.execute({
        action: 'status',
        sessionId
      });
      const endTime = Date.now();
      const actualDuration = endTime - startTime;

      // Limpar o processo
      await TerminalTool.execute({
        action: 'kill',
        sessionId
      });

      // Verificar se o tempo é muito rápido (menos de 100ms)
      expect(actualDuration).toBeLessThan(100);
      expect(statusResult.status).toBe('running');
    });
  });

  describe('Process Management', () => {
    it('deve criar processo em background', async () => {
      const sessionId = randomUUID();
      
      const createResult = await TerminalTool.execute({
        action: 'create',
        command: process.platform === 'win32' ? 'ping -n 5 127.0.0.1' : 'sleep 5',
        background: true,
        sessionId
      });

      expect(createResult.success).toBe(true);
      expect(createResult.sessionId).toBe(sessionId);
      expect(createResult.message).toContain('Processo em background criado');

      // Limpar
      await TerminalTool.execute({
        action: 'kill',
        sessionId
      });
    });

    it('deve listar processos ativos', async () => {
      const sessionId1 = randomUUID();
      const sessionId2 = randomUUID();

      // Criar dois processos
      await TerminalTool.execute({
        action: 'create',
        command: process.platform === 'win32' ? 'ping -n 5 127.0.0.1' : 'sleep 5',
        background: true,
        sessionId: sessionId1
      });

      await TerminalTool.execute({
        action: 'create',
        command: process.platform === 'win32' ? 'ping -n 5 127.0.0.1' : 'sleep 5',
        background: true,
        sessionId: sessionId2
      });

      // Listar processos
      const listResult = await TerminalTool.execute({
        action: 'list'
      });

      expect(listResult.success).toBe(true);
      expect(listResult.processes).toBeDefined();
      expect(listResult.processes!.length).toBeGreaterThanOrEqual(2);

      // Limpar
      await TerminalTool.execute({
        action: 'kill',
        sessionId: sessionId1
      });

      await TerminalTool.execute({
        action: 'kill',
        sessionId: sessionId2
      });
    });

    it('deve matar processo', async () => {
      const sessionId = randomUUID();
      
      // Criar processo
      const createResult = await TerminalTool.execute({
        action: 'create',
        command: process.platform === 'win32' ? 'ping -n 10 127.0.0.1' : 'sleep 10',
        background: true,
        sessionId
      });

      expect(createResult.success).toBe(true);

      // Matar processo
      const killResult = await TerminalTool.execute({
        action: 'kill',
        sessionId
      });

      expect(killResult.success).toBe(true);
      expect(killResult.message).toContain('finalizado');

      // Verificar que o processo não existe mais
      const statusResult = await TerminalTool.execute({
        action: 'status',
        sessionId
      });

      expect(statusResult.success).toBe(false);
      expect(statusResult.message).toContain('Sessão de processo não encontrada');
    });
  });

  describe('Validation', () => {
    it('deve exigir command para action=create', async () => {
      const result = await TerminalTool.execute({
        action: 'create'
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Comando é obrigatório');
    });

    it('deve exigir sessionId para action=status', async () => {
      const result = await TerminalTool.execute({
        action: 'status'
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('SessionId é obrigatório');
    });

    it('deve exigir sessionId para action=kill', async () => {
      const result = await TerminalTool.execute({
        action: 'kill'
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('SessionId é obrigatório');
    });

    it('deve exigir sessionId e input para action=send', async () => {
      const result1 = await TerminalTool.execute({
        action: 'send',
        sessionId: randomUUID()
      });

      expect(result1.success).toBe(false);
      expect(result1.message).toContain('Input é obrigatório');

      const result2 = await TerminalTool.execute({
        action: 'send',
        input: 'test'
      });

      expect(result2.success).toBe(false);
      expect(result2.message).toContain('SessionId é obrigatório');
    });
  });
});

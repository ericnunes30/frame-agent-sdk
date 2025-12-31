import { TerminalTool } from '@/tools/tools/terminalTool';
import { randomUUID } from 'crypto';

describe('TerminalTool - Blocking Test', () => {
  it('deve bloquear a execução por 2000ms', async () => {
    const sessionId = randomUUID();
    
    // Criar um processo
    const createResult = await TerminalTool.execute({
      action: 'create',
      command: process.platform === 'win32' ? 'timeout /t 10' : 'sleep 10',
      background: true,
      sessionId
    });

    console.log('[TEST] Processo criado:', createResult.message);

    // Medir o tempo real da chamada status
    const startTime = Date.now();
    console.log('[TEST] Iniciando status com timeout de 2000ms...');
    
    const statusResult = await TerminalTool.execute({
      action: 'status',
      sessionId,
      statusTimeout: 2000
    });
    
    const endTime = Date.now();
    const actualDuration = endTime - startTime;

    console.log('[TEST] Status completou após:', actualDuration, 'ms');
    console.log('[TEST] Resultado:', statusResult);

    // Limpar o processo
    await TerminalTool.execute({
      action: 'kill',
      sessionId
    });

    // Verificar se o tempo está próximo de 2000ms
    expect(actualDuration).toBeGreaterThanOrEqual(1900);
    expect(actualDuration).toBeLessThan(2100);
  }, 30000);

  it('deve bloquear a execução por 5000ms', async () => {
    const sessionId = randomUUID();
    
    // Criar um processo
    const createResult = await TerminalTool.execute({
      action: 'create',
      command: process.platform === 'win32' ? 'timeout /t 10' : 'sleep 10',
      background: true,
      sessionId
    });

    console.log('[TEST] Processo criado:', createResult.message);

    // Medir o tempo real da chamada status
    const startTime = Date.now();
    console.log('[TEST] Iniciando status com timeout de 5000ms...');
    
    const statusResult = await TerminalTool.execute({
      action: 'status',
      sessionId,
      statusTimeout: 5000
    });
    
    const endTime = Date.now();
    const actualDuration = endTime - startTime;

    console.log('[TEST] Status completou após:', actualDuration, 'ms');

    // Limpar o processo
    await TerminalTool.execute({
      action: 'kill',
      sessionId
    });

    // Verificar se o tempo está próximo de 5000ms
    expect(actualDuration).toBeGreaterThanOrEqual(4900);
    expect(actualDuration).toBeLessThan(5100);
  }, 30000);
});

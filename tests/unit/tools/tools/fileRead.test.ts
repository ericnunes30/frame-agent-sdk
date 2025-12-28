// Teste para reproduzir o erro de validação do file_read
import { FileReadTool } from '@/tools/tools/fileReadTool';
import { validateToolParams } from '@/tools/core/toolValidator';

describe('file_read validation bug', () => {
  it('should validate file_read with correct params', () => {
    console.log('=== Teste de Validação file_read ===\n');

    // 1. Verificar schema da ferramenta
    console.log('1. Schema da ferramenta:');
    console.log('  name:', FileReadTool.name);
    console.log('  parameterSchema:', FileReadTool.parameterSchema);
    console.log('  schemaProperties:', (FileReadTool.parameterSchema as any)?.schemaProperties);
    console.log('');

    // 2. Testar validação com parâmetros corretos
    const correctParams = {
      filePath: 'G:/novosApps/agentes/frame-code-cli/package.json'
    };

    console.log('2. Testando parâmetros CORRETOS:');
    console.log('  params:', JSON.stringify(correctParams, null, 2));
    const result1 = validateToolParams(FileReadTool, correctParams);
    console.log('  valid:', result1.valid);
    console.log('  issues:', result1.issues);
    console.log('');

    // 3. Testar com barra invertida (como no log)
    const backslashParams = {
      filePath: 'G:\\novosApps\\agentes\\frame-code-cli\\package.json'
    };

    console.log('3. Testando com barras invertidas (como no log):');
    console.log('  params:', JSON.stringify(backslashParams, null, 2));
    const result2 = validateToolParams(FileReadTool, backslashParams);
    console.log('  valid:', result2.valid);
    console.log('  issues:', result2.issues);
    console.log('');

    // 4. Testar sem filePath (deve falhar)
    const missingParams = {};

    console.log('4. Testando SEM filePath (deve falhar):');
    console.log('  params:', JSON.stringify(missingParams, null, 2));
    const result3 = validateToolParams(FileReadTool, missingParams);
    console.log('  valid:', result3.valid);
    console.log('  issues:', result3.issues);
    console.log('');

    // 5. Verificar tipo do parameterSchema
    console.log('5. Tipos:');
    console.log('  typeof parameterSchema:', typeof FileReadTool.parameterSchema);
    console.log('  parameterSchema constructor:', (FileReadTool.parameterSchema as any)?.constructor?.name);
    console.log('');

    // 6. Verificar se schemaProperties existe
    const schemaClass = FileReadTool.parameterSchema as { schemaProperties?: Record<string, unknown> } | undefined;
    console.log('6. schemaProperties:');
    console.log('  existe:', !!schemaClass?.schemaProperties);
    console.log('  valor:', schemaClass?.schemaProperties);

    // Assertion para confirmar que a validação deveria passar
    expect(result1.valid).toBe(true);
  });
});

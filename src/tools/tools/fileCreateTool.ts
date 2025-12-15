import { ToolBase } from '@/tools/constructor/toolBase';
import { IToolParams } from '@/tools/core/interfaces';
import * as fs from 'fs';
import * as path from 'path';

interface FileCreateParams extends IToolParams {
  filePath: string;
  content: string;
}

class FileCreateParams {
  static schemaProperties = {
    filePath: 'string',
    content: 'string',
  } as const;
}

export const FileCreateTool = new class extends ToolBase<FileCreateParams, { success: boolean; message: string }> {
  public readonly name = 'file_create';
  public readonly description = 'Criar novos arquivos com conteúdo (aceita "/" e "\\" em caminhos)';
  public readonly parameterSchema = FileCreateParams;

  public async execute(params: FileCreateParams): Promise<{ success: boolean; message: string }> {
    try {
      const dir = path.dirname(params.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(params.filePath, params.content);

      return { success: true, message: `✓ Arquivo criado com sucesso: ${params.filePath}` };
    } catch (error: any) {
      const message = error?.message ?? 'motivo desconhecido';
      throw new Error(`✗ Erro ao criar arquivo ${params.filePath}: ${message} (use "/" ou "\\")`);
    }
  }
}();

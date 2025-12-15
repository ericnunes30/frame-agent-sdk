import { ToolBase } from '@/tools/constructor/toolBase';
import { IToolParams } from '@/tools/core/interfaces';
import * as fs from 'fs';
import * as path from 'path';

interface FileReadParams extends IToolParams {
  filePath: string;
  startLine?: number;
  endLine?: number;
  lineNumbers?: boolean;
}

class FileReadParams {
  static schemaProperties = {
    filePath: 'string',
    startLine: 'number?',
    endLine: 'number?',
    lineNumbers: 'boolean?'
  } as const;
}

export const FileReadTool = new class extends ToolBase<FileReadParams, string> {
  public readonly name = 'file_read';
  public readonly description = 'Ler conteúdo de arquivos com suporte a leitura por linha (aceita "/" e "\\" em caminhos)';
  public readonly parameterSchema = FileReadParams;

  public validarParametros(params: FileReadParams): void {
    if (!params.filePath || params.filePath.trim() === '') {
      throw new Error('✗ Caminho do arquivo é obrigatório');
    }

    if (params.startLine !== undefined && params.startLine < 1) {
      throw new Error('✗ startLine deve ser maior ou igual a 1');
    }

    if (params.endLine !== undefined && params.endLine < 1) {
      throw new Error('✗ endLine deve ser maior ou igual a 1');
    }

    if (params.startLine !== undefined && params.endLine !== undefined && params.startLine > params.endLine) {
      throw new Error('✗ startLine não pode ser maior que endLine');
    }
  }

  public lerArquivoCompleto(filePath: string, lineNumbers: boolean): string {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (!lineNumbers) {
      return content;
    }

    const lines = content.split('\n');
    return lines.map((line, index) => `${index + 1} | ${line}`).join('\n');
  }

  public lerPorLinhas(filePath: string, startLine?: number, endLine?: number, lineNumbers?: boolean): string {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const resultado: string[] = [];
    
    const start = startLine ? Math.max(1, startLine) - 1 : 0;
    const end = endLine ? Math.min(lines.length, endLine) : lines.length;
    
    for (let i = start; i < end; i++) {
      const lineContent = lines[i];
      const formattedLine = lineNumbers ? `${i + 1} | ${lineContent}` : lineContent;
      resultado.push(formattedLine);
    }
    
    return resultado.join('\n');
  }

  public async execute(params: FileReadParams): Promise<string> {
    try {
      this.validarParametros(params);

      const resolvedPath = path.resolve(params.filePath);
      
      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Arquivo não encontrado: ${resolvedPath}`);
      }

      const stats = fs.statSync(resolvedPath);
      if (!stats.isFile()) {
        throw new Error(`Caminho não é um arquivo: ${resolvedPath}`);
      }

      let content: string;

      if (params.startLine === undefined && params.endLine === undefined) {
        content = this.lerArquivoCompleto(resolvedPath, params.lineNumbers || false);
      } else {
        content = this.lerPorLinhas(resolvedPath, params.startLine, params.endLine, params.lineNumbers || false);
      }
      
      return content;
    } catch (error: any) {
      const message = error?.message ?? 'motivo desconhecido';
      throw new Error(`✗ Erro ao ler arquivo ${params.filePath}: ${message}`);
    }
  }
}();

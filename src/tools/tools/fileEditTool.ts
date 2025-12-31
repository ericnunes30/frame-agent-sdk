import { ToolBase } from '@/tools/constructor/toolBase';
import { IToolParams } from '@/tools/core/interfaces';
import * as fs from 'fs';
import fastDiff from 'fast-diff';
import { logger } from '@/utils/logger';

// Constantes para os tipos de operação do fast-diff
const DIFF_EQUAL = 0;
const DIFF_DELETE = -1;
const DIFF_INSERT = 1;

interface SearchReplaceEdit {
  search: string;
  replace: string;
}

interface ApplySearchReplaceParams extends IToolParams {
  filePath: string;
  edits: SearchReplaceEdit[];
}

class ApplySearchReplaceParams {
  static schemaProperties = {
    filePath: 'string',
    edits: 'array',
  } as const;
}

interface ApplySearchReplaceResult {
  success: boolean;
  message: string;
  changesApplied: number;
}

export const FileEditTool = new class extends ToolBase<ApplySearchReplaceParams, ApplySearchReplaceResult> {
  public readonly name = 'file_edit';
  public readonly description = 'Aplica múltiplas substituições de texto em arquivos (busca e substituição cirúrgica)';
  public readonly parameterSchema = ApplySearchReplaceParams;

  public async execute(params: ApplySearchReplaceParams): Promise<ApplySearchReplaceResult> {
    try {
      // LOG: Caminho absoluto do arquivo
      const absolutePath = require('path').resolve(params.filePath);
      logger.info(`[fileEditTool] Caminho do arquivo: ${absolutePath}`);
      logger.info(`[fileEditTool] Caminho relativo: ${params.filePath}`);
      logger.info(`[fileEditTool] Diretório atual: ${process.cwd()}`);
      
      if (!fs.existsSync(params.filePath)) {
        throw new Error(`Arquivo não encontrado: ${params.filePath}`);
      }

      if (!params.edits || params.edits.length === 0) {
        throw new Error('Nenhuma edição fornecida');
      }

      const originalContent = fs.readFileSync(params.filePath, 'utf-8');
      logger.info(`[fileEditTool] Tamanho do conteúdo do arquivo: ${originalContent.length} caracteres`);
      logger.info(`[fileEditTool] Número de linhas: ${originalContent.split('\n').length}`);
      logger.info(`[fileEditTool] Primeiras 200 chars: ${JSON.stringify(originalContent.substring(0, 200))}`);
      
      let currentContent = originalContent;
      let changesApplied = 0;
      logger.info(`[fileEditTool] Número de edições: ${params.edits.length}`);

      for (let i = 0; i < params.edits.length; i++) {
        const edit = params.edits[i];
        logger.info(`[fileEditTool] --- Edit #${i + 1} ---`);
        logger.info(`[fileEditTool] Tamanho do search: ${edit.search?.length ?? 0} caracteres`);
        
        if (!edit.search || edit.search.trim() === '') {
          logger.info(`[fileEditTool] Search vazio ou apenas espaços, pulando`);
          continue;
        }

        // LOG: Mostra os primeiros 100 caracteres do search
        logger.info(`[fileEditTool] Search (primeiros 100 chars): ${JSON.stringify(edit.search.substring(0, 100))}`);
        
        const searchIndex = currentContent.indexOf(edit.search);
        logger.info(`[fileEditTool] Índice encontrado: ${searchIndex}`);
        
        if (searchIndex === -1) {
          // LOG: Tenta encontrar o search normalizado
          const normalizedSearch = edit.search.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
          const normalizedIndex = currentContent.indexOf(normalizedSearch);
          logger.info(`[fileEditTool] Índice com normalização de CRLF: ${normalizedIndex}`);
          
          // LOG: Mostra onde deveria estar o texto (primeiros 200 chars do arquivo)
          logger.info(`[fileEditTool] Contexto do arquivo (primeiros 200 chars): ${JSON.stringify(currentContent.substring(0, 200))}`);
          
          // LOG: Verifica se o arquivo contém uma substring do search
          const firstLine = edit.search.split('\n')[0];
          const firstLineIndex = currentContent.indexOf(firstLine);
          logger.info(`[fileEditTool] Primeira linha do search encontrada? ${firstLineIndex !== -1 ? 'SIM (índice: ' + firstLineIndex + ')' : 'NÃO'}`);
          logger.info(`[fileEditTool] Primeira linha do search: ${JSON.stringify(firstLine)}`);
          
          continue;
        }

        const beforeContent = currentContent;
        currentContent = currentContent.replace(edit.search, edit.replace);

        // Usa fast-diff para calcular as diferenças
        const diff = fastDiff(beforeContent, currentContent);
        let hasChanges = false;

        for (const [operation, text] of diff) {
          if (operation !== DIFF_EQUAL) {
            hasChanges = true;
            break;
          }
        }

        if (hasChanges) {
          changesApplied++;
          logger.info(`[fileEditTool] ✓ Substituição aplicada com sucesso!`);
        } else {
          logger.info(`[fileEditTool] ⚠ Substituição realizada mas fast-diff não detectou mudanças`);
        }
      }

      logger.info(`[fileEditTool] Total de substituições aplicadas: ${changesApplied}`);
      
      if (changesApplied === 0) {
        logger.info(`[fileEditTool] ❌ Falha: Nenhuma substituição foi aplicada`);
        return {
          success: false,
          message: `⚠ Nenhuma substituição foi aplicada (patterns não encontrados)`,
          changesApplied: 0
        };
      }
      
      logger.info(`[fileEditTool] ✓ Escrevendo arquivo atualizado...`);

      // Mostra um resumo final das diferenças usando fast-diff
      const finalDiff = fastDiff(originalContent, currentContent);
      let addedLines = 0;
      let removedLines = 0;

      for (const [operation, text] of finalDiff) {
        if (operation === DIFF_INSERT) {
          addedLines += text.split('\n').length - 1;
        } else if (operation === DIFF_DELETE) {
          removedLines += text.split('\n').length - 1;
        }
      }

      fs.writeFileSync(params.filePath, currentContent);
      logger.info(`[fileEditTool] ✓ Arquivo escrito com sucesso (+${addedLines}/-${removedLines} linhas)`);

      return {
        success: true,
        message: `✓ ${changesApplied} substituição(ões) aplicada(s) em: ${params.filePath} (+${addedLines}/-${removedLines} linhas)`,
        changesApplied
      };
    } catch (error: any) {
      const message = error?.message ?? 'motivo desconhecido';
      throw new Error(`✗ Erro ao aplicar substituições em ${params.filePath}: ${message}`);
    }
  }
}();

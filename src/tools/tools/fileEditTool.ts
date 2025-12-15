import { ToolBase } from '@/tools/constructor/toolBase';
import { IToolParams } from '@/tools/core/interfaces';
import * as fs from 'fs';
import fastDiff from 'fast-diff';

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
      if (!fs.existsSync(params.filePath)) {
        throw new Error(`Arquivo não encontrado: ${params.filePath}`);
      }

      if (!params.edits || params.edits.length === 0) {
        throw new Error('Nenhuma edição fornecida');
      }

      const originalContent = fs.readFileSync(params.filePath, 'utf-8');
      let currentContent = originalContent;
      let changesApplied = 0;

      for (const edit of params.edits) {
        if (!edit.search || edit.search.trim() === '') {
          continue;
        }

        const searchIndex = currentContent.indexOf(edit.search);
        if (searchIndex === -1) {
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
        }
      }

      if (changesApplied === 0) {
        return {
          success: false,
          message: `⚠ Nenhuma substituição foi aplicada (patterns não encontrados)`,
          changesApplied: 0
        };
      }

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

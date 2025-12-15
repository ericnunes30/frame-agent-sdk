import { ToolBase } from '@/tools/constructor/toolBase';
import { IToolParams } from '@/tools/core/interfaces';
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

export enum SearchTypeEnum {
  CONTENT = 'content',
  FILENAME = 'filename',
  BOTH = 'both'
}

export enum MatchCaseEnum {
  SENSITIVE = 'sensitive',
  INSENSITIVE = 'insensitive'
}

export enum SearchModeEnum {
  SIMPLE = 'simple',
  REGEX = 'regex'
}

interface SearchParams extends IToolParams {
  query: string;
  searchType?: SearchTypeEnum;
  fileType?: string;
  searchMode?: SearchModeEnum;
  matchCase?: MatchCaseEnum;
  directory?: string;
  maxResults?: number;
  excludePatterns?: string[];
}

interface SearchResult {
  file: string;
  matches: string[];
  matchCount: number;
}

interface SearchResponse {
  success: boolean;
  message: string;
  results: SearchResult[];
  totalMatches: number;
  totalFilesScanned: number;
}

class SearchParams {
  static schemaProperties = {
    query: 'string',
    'searchType?': 'string',
    'fileType?': 'string',
    'searchMode?': 'string',
    'matchCase?': 'string',
    'directory?': 'string',
    'maxResults?': 'number',
    'excludePatterns?': 'array'
  } as const;
}

class AdvancedSearchTool extends ToolBase<SearchParams, SearchResponse> {
  public readonly name = 'search';
  public readonly description = 'Ferramenta avançada de busca com suporte a conteúdo, nomes de arquivos, regex e filtros';
  public readonly parameterSchema = SearchParams;

  private readonly defaultExcludePatterns = ['node_modules/**', 'dist/**', '.git/**'];

  private validateAndParseParams(params: SearchParams): SearchParams {
    // Mapear valores inválidos comuns para os valores corretos
    const invalidToValidMap: { [key: string]: SearchTypeEnum } = {
      'file': SearchTypeEnum.FILENAME,
      'fileContent': SearchTypeEnum.CONTENT,
      'filecontent': SearchTypeEnum.CONTENT,
      'files': SearchTypeEnum.FILENAME,
      'name': SearchTypeEnum.FILENAME,
      'content': SearchTypeEnum.CONTENT
    };
    
    const searchTypeValue = params.searchType as any;
    if (searchTypeValue && invalidToValidMap[searchTypeValue]) {
      const correctedValue = invalidToValidMap[searchTypeValue];
      params.searchType = correctedValue;
    }
    
    if (!params.query || params.query.trim() === '') {
      throw new Error('Query não pode estar vazia');
    }

    return params;
  }

  private buildGlobPattern(fileType?: string): string {
    if (!fileType) {
      return '**/*';
    }

    if (fileType.startsWith('.')) {
      return `**/*${fileType}`;
    }

    return `**/*.${fileType}`;
  }

  private buildIgnorePatterns(excludePatterns?: string[]): string[] {
    const patterns = [...this.defaultExcludePatterns];
    
    if (excludePatterns) {
      patterns.push(...excludePatterns);
    }

    return patterns;
  }

  private normalizeQuery(query: string, matchCase: MatchCaseEnum): string {
    if (matchCase === MatchCaseEnum.INSENSITIVE) {
      return query.toLowerCase();
    }
    return query;
  }

  private createRegex(query: string, searchMode: SearchModeEnum, matchCase: MatchCaseEnum): RegExp {
    if (searchMode === SearchModeEnum.SIMPLE) {
      const flags = matchCase === MatchCaseEnum.INSENSITIVE ? 'gi' : 'g';
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(escapedQuery, flags);
    }

    const flags = matchCase === MatchCaseEnum.INSENSITIVE ? 'gi' : 'g';
    
    try {
      return new RegExp(query, flags);
    } catch (error) {
      throw new Error(`Regex inválido: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private searchInContent(content: string, regex: RegExp, searchMode: SearchModeEnum): string[] {
    const matches: string[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (searchMode === SearchModeEnum.SIMPLE) {
        if (regex.test(line)) {
          matches.push(`L${index + 1}: ${line.trim()}`);
        }
      } else {
        const lineMatches = line.match(regex);
        if (lineMatches) {
          matches.push(`L${index + 1}: ${line.trim()} (${lineMatches.length} matches)`);
        }
      }
    });

    return matches;
  }

  private searchInFilename(filename: string, regex: RegExp): boolean {
    return regex.test(filename);
  }

  public async execute(params: SearchParams): Promise<SearchResponse> {
    const validatedParams = this.validateAndParseParams(params);
    
    const {
      query,
      searchType = SearchTypeEnum.BOTH,
      fileType,
      searchMode = SearchModeEnum.SIMPLE,
      matchCase = MatchCaseEnum.INSENSITIVE,
      directory = process.cwd(),
      maxResults = 100,
      excludePatterns
    } = validatedParams;
    
    // Determinar quais tipos de busca realizar
    const shouldSearchContent = searchType === SearchTypeEnum.CONTENT || searchType === SearchTypeEnum.BOTH;
    const shouldSearchFilename = searchType === SearchTypeEnum.FILENAME || searchType === SearchTypeEnum.BOTH;

    try {
      const pattern = this.buildGlobPattern(fileType);
      const ignorePatterns = this.buildIgnorePatterns(excludePatterns);
      const searchRegex = this.createRegex(query, searchMode, matchCase);

      // Garantir que o diretório seja absoluto
      const absoluteDirectory = path.isAbsolute(directory)
        ? directory
        : path.resolve(process.cwd(), directory);

      // Verificar se o diretório existe
      try {
        await fs.promises.access(absoluteDirectory, fs.constants.R_OK);
      } catch (error) {
        throw new Error(`Diretório não encontrado ou sem permissão: ${directory}`);
      }

      const files = await glob(pattern, {
        cwd: absoluteDirectory,
        ignore: ignorePatterns,
        nodir: true,
        absolute: true
      });

      const results: SearchResult[] = [];
      let totalMatches = 0;
      let filesScanned = 0;

      for (const file of files) {
        if (results.length >= maxResults) {
          break;
        }
   
        filesScanned++;
        const fileName = path.basename(file);
        let fileMatches: string[] = [];
        let matchCount = 0;
  
        try {
          // Usar as variáveis pré-definidas para determinar quais buscas realizar
          if (shouldSearchFilename && this.searchInFilename(fileName, searchRegex)) {
            fileMatches.push(`Nome do arquivo: ${fileName}`);
            matchCount++;
          }

          if (shouldSearchContent) {
            const content = await fs.promises.readFile(file, 'utf-8');
            const contentMatches = this.searchInContent(content, searchRegex, searchMode);
            
            if (contentMatches.length > 0) {
              fileMatches.push(...contentMatches);
              matchCount += contentMatches.length;
            }
          }

          if (matchCount > 0) {
            results.push({
              file,
              matches: fileMatches,
              matchCount
            });
            totalMatches += matchCount;
          }
        } catch (error) {
          // Continuar processando outros arquivos mesmo em caso de erro
        }
      }

      const message = `Busca concluída. Encontrados ${totalMatches} matches em ${results.length} arquivos (${filesScanned} arquivos escaneados)`;

      return {
        success: true,
        message,
        results,
        totalMatches,
        totalFilesScanned: filesScanned
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Falha ao executar a busca: ${error.message}`,
        results: [],
        totalMatches: 0,
        totalFilesScanned: 0
      };
    }
  }
}

export const SearchTool = new AdvancedSearchTool();

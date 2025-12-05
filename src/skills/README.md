# Módulo de Skills - Frame Agent SDK

O módulo de Skills fornece um sistema para gerenciar contexto especializado dinamicamente, evitando a explosão da janela de contexto ao usar múltiplos MCP servers.

## Visão Geral

Este módulo exporta funcionalidades para:
- Definição de skills através de interfaces
- Gerenciamento de skills com o `SkillManager`
- Carregamento de skills do filesystem
- Cálculo de relevância de skills com base em keywords
- Formatação de skills para inclusão no prompt do agente

## Componentes Principais

### 1. ISkill Interface

Interface para definição de Skills:

```typescript
export interface ISkill {
  name: string;
  description: string;
  keywords: string[];          // Para cálculo de relevância
  instructions: string;        // Conteúdo do skill
  priority?: number;           // 1-10, maior = mais importante
  maxTokens?: number;          // Limite de tokens (estimado)
  enabled?: boolean;           // Permite desativar temporariamente
}
```

### 2. ISkillManager Interface

Interface para gerenciamento de skills:

```typescript
export interface ISkillManager {
  loadSkill(skillPath: string): Promise<ISkill>;
  loadSkillsFromDirectory(dirPath: string): Promise<ISkill[]>;
  getRelevantSkills(context: string, maxSkills?: number): ISkill[];
  calculateRelevance(skill: ISkill, context: string): number;
  formatSkillsForPrompt(skills: ISkill[]): string;
}
```

### 3. SkillManager

Implementação concreta do `ISkillManager`:

```typescript
export class SkillManager implements ISkillManager {
  constructor(config?: SkillConfig);
  // ... métodos implementados
}
```

### 4. SkillConfig

Configuração do SkillManager:

```typescript
export interface SkillConfig {
  skillsDirectory?: string;    // Default: .code-skills/
  maxTotalTokens?: number;     // Limite total de tokens para skills
  relevanceThreshold?: number; // 0-1, mínimo para inclusão
  defaultPriority?: number;    // Prioridade padrão
}
```

## Formato de Arquivo de Skill

Os skills são arquivos markdown com frontmatter YAML:

```markdown
---
name: solid-principles
description: Princípios SOLID para desenvolvimento OOP
keywords: [class, interface, solid, oop, design, pattern]
priority: 8
maxTokens: 500
---

# Princípios SOLID

Conteúdo das instruções do skill...
```

## Uso Básico

```typescript
import { SkillManager } from 'frame-agent-sdk/skills';

// Criar um SkillManager
const skillManager = new SkillManager({
  skillsDirectory: '.code-skills',
  maxTotalTokens: 4000,
  relevanceThreshold: 0.3,
  defaultPriority: 5
});

// Carregar skills de um diretório
const skills = await skillManager.loadSkillsFromDirectory('./.code-skills');

// Obter skills relevantes para um contexto
const relevantSkills = skillManager.getRelevantSkills('Preciso refatorar esta classe seguindo os princípios SOLID');

// Formatar skills para prompt
const skillsPrompt = skillManager.formatSkillsForPrompt(relevantSkills);
```
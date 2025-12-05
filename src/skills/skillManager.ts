import { ISkill, ISkillManager, SkillConfig } from './skill.interface';
import { logger } from '@/utils/logger';

export class SkillManager implements ISkillManager {
  private skills: Map<string, ISkill> = new Map();
  private config: SkillConfig;

  constructor(config?: SkillConfig) {
    this.config = config || {};
  }

  addSkill(skill: ISkill): void {
    this.skills.set(skill.name, skill);
    logger.debug(`Skill added: ${skill.name}`);
  }

  getAllSkills(): ISkill[] {
    return Array.from(this.skills.values());
  }

  formatSkillsForPrompt(skills: ISkill[]): string {
    if (!skills || skills.length === 0) return '';
    
    return `## Active Skills\n\n${skills.map(s => 
      `- **${s.name}**: ${s.description}`
    ).join('\n')}`;
  }
}
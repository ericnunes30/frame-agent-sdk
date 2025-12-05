export interface ISkill {
  name: string;
  description: string;
  keywords: string[];
  instructions: string;
}

export interface ISkillManager {
  addSkill(skill: ISkill): void;
  getAllSkills(): ISkill[];
  formatSkillsForPrompt(skills: ISkill[]): string;
}

export interface SkillConfig {
  // Config vazia - SkillManager não gerencia filesystem ou prioridades
  // Isso fica por conta da aplicação que usa o SDK
}
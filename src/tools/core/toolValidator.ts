// src/tools/core/toolValidator.ts
import { ITool, PropertyDescriptor, PropertyType, SchemaProperties, ToolValidationIssue, ToolValidationResult } from '@/tools/core/interfaces';

// Basic descriptor for class-based schema via static `schemaProperties`
// types moved to interfaces.ts

function isDescriptor(v: unknown): v is PropertyDescriptor {
  const isObject = !!v && typeof v === 'object';
  const hasTypeProperty = isObject && 'type' in (v as Record<string, unknown>);
  return hasTypeProperty;
}

function typeOf(value: unknown): PropertyType {
  if (Array.isArray(value)) return 'array';
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'object';
}

function normalizeDescriptor(rawKey: string, rawDesc: PropertyType | PropertyDescriptor): { key: string; desc: PropertyDescriptor } {
  const key = rawKey.replace(/\?$/, '');
  const desc: PropertyDescriptor = isDescriptor(rawDesc)
    ? { required: true, ...(rawDesc as PropertyDescriptor) }
    : { type: rawDesc as PropertyType, required: !rawKey.endsWith('?') };
  return { key, desc };
}

function validatePresence(key: string, desc: PropertyDescriptor, value: unknown): ToolValidationIssue | null {
  const present = value !== undefined && value !== null;
  if ((desc.required ?? true) && !present) {
    return { path: key, code: 'missing_required', message: `Property '${key}' is required` };
  }
  return null;
}

function validateType(key: string, expected: PropertyType, value: unknown): ToolValidationIssue | null {
  if (value === undefined || value === null) return null; // handled by presence
  const t = typeOf(value);
  return t === expected ? null : { path: key, code: 'invalid_type', message: `Property '${key}' must be of type ${expected}` };
}

function validateEnum(key: string, desc: PropertyDescriptor, value: unknown): ToolValidationIssue | null {
  if (!desc.enum || value === undefined || value === null) return null;
  return (desc.enum as ReadonlyArray<unknown>).includes(value as unknown)
    ? null
    : { path: key, code: 'invalid_enum', message: `Property '${key}' must be one of: ${desc.enum.join(', ')}` };
}

function validateNumberRange(key: string, desc: PropertyDescriptor, value: unknown): ToolValidationIssue[] {
  if (typeOf(value) !== 'number') return [];
  const v = value as number;
  const out: ToolValidationIssue[] = [];
  if (typeof desc.min === 'number' && v < desc.min) {
    out.push({ path: key, code: 'out_of_range', message: `Property '${key}' must be >= ${desc.min}` });
  }
  if (typeof desc.max === 'number' && v > desc.max) {
    out.push({ path: key, code: 'out_of_range', message: `Property '${key}' must be <= ${desc.max}` });
  }
  return out;
}

function validateLengthConstraints(key: string, desc: PropertyDescriptor, value: unknown): ToolValidationIssue[] {
  const t = typeOf(value);
  if (t !== 'string' && t !== 'array') return [];
  const len = t === 'string' ? (value as string).length : (value as unknown[]).length;
  const out: ToolValidationIssue[] = [];
  if (typeof desc.minLength === 'number' && len < desc.minLength) {
    out.push({ path: key, code: 'length_out_of_range', message: `Property '${key}' length must be >= ${desc.minLength}` });
  }
  if (typeof desc.maxLength === 'number' && len > desc.maxLength) {
    out.push({ path: key, code: 'length_out_of_range', message: `Property '${key}' length must be <= ${desc.maxLength}` });
  }
  return out;
}

export function validateToolParams(tool: ITool, params: unknown): ToolValidationResult {
  const schemaClass = tool.parameterSchema as { schemaProperties?: SchemaProperties } | undefined;
  const schemaProps: SchemaProperties = (schemaClass && schemaClass.schemaProperties) || {};

  const issues: ToolValidationIssue[] = [];

  for (const [rawKey, rawDesc] of Object.entries(schemaProps)) {
    const { key, desc } = normalizeDescriptor(rawKey, rawDesc as PropertyType | PropertyDescriptor);
    const value = (params as Record<string, unknown> | undefined)?.[key];

    const missing = validatePresence(key, desc, value);
    if (missing) {
      issues.push(missing);
    }

    // Early return para valores nulos/undefined - evita validações desnecessárias
    if (value === undefined || value === null) {
      continue;
    }

    const typeIssue = validateType(key, desc.type, value);
    if (typeIssue) {
      issues.push(typeIssue);
    }

    const enumIssue = validateEnum(key, desc, value);
    if (enumIssue) {
      issues.push(enumIssue);
    }

    issues.push(
      ...validateNumberRange(key, desc, value),
      ...validateLengthConstraints(key, desc, value),
    );
  }

  return { valid: issues.length === 0, issues: issues.length ? issues : undefined };
}

export function formatIssuesForLLM(issues: ToolValidationIssue[]): string {
  const bullets = issues
    .map((i) => `- ${i.path}: ${i.message}`)
    .join('\n');
  return `Your tool output does not match the required schema. Fix these issues and try again using the exact JSON format.\n${bullets}`;
}
/**
 * Utilitários de validação de parâmetros de ferramentas (JSON Schema / tipagem).
 * Retornam informações amigáveis para serem usadas como dicas ao LLM.
 */

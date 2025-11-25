// tests/unit/tools/constructor/schemaGenerator.test.ts
import { generateTypedSchema } from '@/tools/constructor/schemaGenerator';
import { ITool, IToolParams, SchemaProperties } from '@/tools/core/interfaces';

// Mock classes para testes
class SimpleSearchParams implements IToolParams {
    static schemaProperties: SchemaProperties = {
        query: 'string',
        maxResults: 'number'
    };
}

class OptionalFieldsParams implements IToolParams {
    static schemaProperties: SchemaProperties = {
        required: 'string',
        'optional?': 'string'
    };
}

class ArrayFieldParams implements IToolParams {
    static schemaProperties: SchemaProperties = {
        tags: {
            type: 'array',
            items: 'string'
        }
    };
}

class EnumFieldParams implements IToolParams {
    static schemaProperties: SchemaProperties = {
        status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'completed']
        }
    };
}

class RangeFieldParams implements IToolParams {
    static schemaProperties: SchemaProperties = {
        age: {
            type: 'number',
            min: 0,
            max: 120
        }
    };
}

class LengthFieldParams implements IToolParams {
    static schemaProperties: SchemaProperties = {
        username: {
            type: 'string',
            minLength: 3,
            maxLength: 20
        }
    };
}

// Helper para criar mock tools
function createMockTool(name: string, parameterSchema: unknown): ITool {
    return {
        name,
        description: `Tool ${name}`,
        parameterSchema,
        execute: async () => 'result'
    };
}

describe('generateTypedSchema', () => {
    describe('tipos primitivos', () => {
        it('deve gerar schema SAP correto para string e number', () => {
            // Arrange
            const tool = createMockTool('search', SimpleSearchParams);

            // Act
            const schema = generateTypedSchema(tool);

            // Assert
            expect(schema).toContain('class search = {');
            expect(schema).toContain('query: string;');
            expect(schema).toContain('maxResults: number;');
            expect(schema).toContain('}');
        });

        it('deve formatar schema no padrão class TypeName', () => {
            // Arrange
            const tool = createMockTool('my_tool', SimpleSearchParams);

            // Act
            const schema = generateTypedSchema(tool);

            // Assert
            expect(schema).toMatch(/^class my_tool = \{/);
            expect(schema).toMatch(/\}$/);
        });
    });

    describe('propriedades opcionais', () => {
        it('deve incluir propriedades opcionais corretamente', () => {
            // Arrange
            const tool = createMockTool('optional_test', OptionalFieldsParams);

            // Act
            const schema = generateTypedSchema(tool);

            // Assert
            expect(schema).toContain('required: string;');
            expect(schema).toContain('optional?: string;');
        });
    });

    describe('arrays', () => {
        it('deve gerar schema SAP para arrays', () => {
            // Arrange
            const tool = createMockTool('array_test', ArrayFieldParams);

            // Act
            const schema = generateTypedSchema(tool);

            // Assert
            expect(schema).toContain('tags: string[];');
        });
    });

    describe('enums', () => {
        it('deve incluir descrições de enum', () => {
            // Arrange
            const tool = createMockTool('enum_test', EnumFieldParams);

            // Act
            const schema = generateTypedSchema(tool);

            // Assert
            expect(schema).toContain('status: string;');
            expect(schema).toContain('// enum: pending, in_progress, completed');
        });
    });

    describe('validações de range', () => {
        it('deve incluir range constraints', () => {
            // Arrange
            const tool = createMockTool('range_test', RangeFieldParams);

            // Act
            const schema = generateTypedSchema(tool);

            // Assert
            expect(schema).toContain('age: number;');
            expect(schema).toContain('// range: min=0, max=120');
        });
    });

    describe('validações de length', () => {
        it('deve incluir length constraints', () => {
            // Arrange
            const tool = createMockTool('length_test', LengthFieldParams);

            // Act
            const schema = generateTypedSchema(tool);

            // Assert
            expect(schema).toContain('username: string;');
            expect(schema).toContain('// length: min=3, max=20');
        });
    });

    describe('schema vazio', () => {
        it('deve gerar schema vazio quando não há propriedades', () => {
            // Arrange
            const tool = createMockTool('empty_tool', {});

            // Act
            const schema = generateTypedSchema(tool);

            // Assert
            expect(schema).toBe('class empty_tool = {}');
        });

        it('deve gerar schema vazio quando parameterSchema é undefined', () => {
            // Arrange
            const tool = createMockTool('undefined_schema', undefined);

            // Act
            const schema = generateTypedSchema(tool);

            // Assert
            expect(schema).toBe('class undefined_schema = {}');
        });
    });

    describe('JSON Schema (MCP format)', () => {
        it('deve converter JSON Schema para SAP format', () => {
            // Arrange
            const jsonSchema = {
                type: 'object',
                properties: {
                    query: { type: 'string' },
                    limit: { type: 'number' }
                },
                required: ['query']
            };
            const tool = createMockTool('json_schema_test', jsonSchema);

            // Act
            const schema = generateTypedSchema(tool);

            // Assert
            // O schema deve ser convertido pelo MCPToSAPConverter
            expect(schema).toContain('class');
            expect(schema).toContain('query');
            expect(schema).toContain('string');
        });
    });

    describe('objetos aninhados', () => {
        it('deve gerar schema para objetos aninhados simples', () => {
            // Arrange
            class NestedParams implements IToolParams {
                static schemaProperties: SchemaProperties = {
                    metadata: 'object',
                    count: 'number'
                };
            }
            const tool = createMockTool('nested_test', NestedParams);

            // Act
            const schema = generateTypedSchema(tool);

            // Assert
            expect(schema).toContain('metadata: object;');
            expect(schema).toContain('count: number;');
        });
    });
});

/**
 * Exemplo: Estratégia de Compressão Personalizada (Corrigido)
 */

import { ChatHistoryManager } from '../src/memory/chatHistoryManager';
import { TokenizerService } from '../src/memory/tokenizer';
import { Message } from '../src/memory/memory.interface';

console.log('=== Exemplo: Estratégias de Compressão ===\n');

const tokenizer = new TokenizerService('gpt-4');
const config = {
    maxContextTokens: 2000,
    tokenizer
};

// Estratégia 1: FIFO (First In, First Out)
console.log('1. Estratégia FIFO - Remove mensagens mais antigas:');
function compressFIFO(manager: ChatHistoryManager, targetMessages: number): void {
    const current = manager.exportHistory();
    
    const systemPrompt = current.find(msg => msg.role === 'system');
    const otherMessages = current.filter(msg => msg.role !== 'system');
    
    const recent = otherMessages.slice(-targetMessages);
    
    const compressed = systemPrompt ? [systemPrompt, ...recent] : recent;
    
    console.log(`   Antes: ${current.length} mensagens`);
    console.log(`   Depois: ${compressed.length} mensagens`);
    console.log(`   Removidas: ${current.length - compressed.length} mensagens`);
    
    manager.importHistory(compressed);
}

// Estratégia 2: Por Importância
console.log('\n2. Estratégia por Importância:');
function compressByImportance(manager: ChatHistoryManager, threshold: number): void {
    const current = manager.exportHistory();
    
    const importantKeywords = ['erro', 'bug', 'problema', 'solução', 'importante'];
    
    const systemPrompt = current.find(msg => msg.role === 'system');
    const otherMessages = current.filter(msg => msg.role !== 'system');
    
    const importantMessages = otherMessages.filter(msg => 
        importantKeywords.some(keyword => 
            msg.content.toLowerCase().includes(keyword.toLowerCase())
        )
    );
    
    const normalMessages = otherMessages.filter(msg => 
        !importantMessages.includes(msg)
    );
    
    const recentNormal = normalMessages.slice(-threshold);
    const compressed = systemPrompt 
        ? [systemPrompt, ...importantMessages, ...recentNormal]
        : [...importantMessages, ...recentNormal];
    
    console.log(`   Mensagens importantes: ${importantMessages.length}`);
    console.log(`   Mensagens normais recentes: ${recentNormal.length}`);
    console.log(`   Total após compressão: ${compressed.length}`);
    
    manager.importHistory(compressed);
}

// Estratégia 3: Sumarização
console.log('\n3. Estratégia de Sumarização:');
function compressBySummarization(manager: ChatHistoryManager, maxTokens: number): void {
    const current = manager.exportHistory();
    const currentTokens = tokenizer.countTokens(current);
    
    if (currentTokens <= maxTokens) {
        console.log('   Nenhuma compressão necessária');
        return;
    }
    
    const systemPrompt = current.find(msg => msg.role === 'system');
    const otherMessages = current.filter(msg => msg.role !== 'system');
    
    const keepIntact = 3;
    const recentMessages = otherMessages.slice(-keepIntact);
    const toCompress = otherMessages.slice(0, -keepIntact);
    
    const compressed = toCompress.map(msg => ({
        ...msg,
        content: `[RESUMIDO: ${msg.content.substring(0, 50)}...]`
    }));
    
    const finalHistory = systemPrompt 
        ? [systemPrompt, ...compressed, ...recentMessages]
        : [...compressed, ...recentMessages];
    
    const newTokens = tokenizer.countTokens(finalHistory);
    
    console.log(`   Tokens antes: ${currentTokens}`);
    console.log(`   Tokens depois: ${newTokens}`);
    console.log(`   Economia: ${currentTokens - newTokens} tokens`);
    
    manager.importHistory(finalHistory);
}

// Estratégia 4: Híbrida
console.log('\n4. Estratégia Híbrida Inteligente:');
function hybridCompression(manager: ChatHistoryManager): void {
    const current = manager.exportHistory();
    const remainingBudget = manager.getRemainingBudget();
    const maxTokens = 2000;
    const usageRatio = (maxTokens - remainingBudget) / maxTokens;
    
    console.log(`   Taxa de uso: ${(usageRatio * 100).toFixed(1)}%`);
    
    if (usageRatio < 0.5) {
        console.log('   Uso baixo, sem compressão necessária');
        return;
    }
    
    if (usageRatio < 0.7) {
        console.log('   Uso médio, aplicando FIFO leve');
        compressFIFO(manager, Math.floor(current.length * 0.8));
        return;
    }
    
    if (usageRatio < 0.9) {
        console.log('   Uso alto, aplicando compressão por importância');
        compressByImportance(manager, 5);
        return;
    }
    
    console.log('   Uso crítico, aplicando sumarização agressiva');
    compressBySummarization(manager, Math.floor(maxTokens * 0.6));
}

// Demonstração
console.log('\n=== Demonstração Prática ===\n');

const history = new ChatHistoryManager(config);
history.addSystemPrompt('Você é um assistente especializado em desenvolvimento de software.');

const conversation = [
    { role: 'user', content: 'Como implementar autenticação JWT?' },
    { role: 'assistant', content: 'Para JWT, use jsonwebtoken com bcryptjs...' },
    { role: 'user', content: 'Encontrei um bug no código de autenticação' },
    { role: 'assistant', content: 'Vamos analisar o bug. Mostre o código...' },
    { role: 'user', content: 'Como fazer deploy em produção?' },
    { role: 'assistant', content: 'Para deploy, use Docker e CI/CD...' },
    { role: 'user', content: 'Qual a melhor prática para testes?' },
    { role: 'assistant', content: 'Use TDD com Jest e Cypress...' }
];

conversation.forEach((msg, i) => {
    history.addMessage({ id: 'msg-' + i, ...msg });
});

console.log(`Histórico inicial: ${history.exportHistory().length} mensagens`);
console.log(`Tokens restantes: ${history.getRemainingBudget()}\n`);

// Testar estratégia híbrida
hybridCompression(history);

console.log('\n=== Dicas para Implementação ===\n');
console.log('1. Monitore o uso de tokens regularmente');
console.log('2. Escolha a estratégia baseada no seu caso de uso');
console.log('3. Considere o contexto do seu agente');
console.log('4. Teste diferentes limiares e estratégias');
console.log('5. Preserve sempre informações críticas');

console.log('\n=== Exemplo Concluído ===');

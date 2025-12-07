/**
 * Exemplo: Guia dos Novos Métodos de Controle de Memória (Final Corrigido)
 */

import { ChatHistoryManager } from '../src/memory/chatHistoryManager';
import { TokenizerService } from '../src/memory/tokenizer';
import { Message } from '../src/memory/memory.interface';

console.log('=== Guia dos Novos Métodos de Controle de Memória ===\n');

const tokenizer = new TokenizerService('gpt-4');
const config = {
    maxContextTokens: 1500,
    tokenizer
};

const history = new ChatHistoryManager(config);

// Adicionar dados de exemplo
history.addSystemPrompt('Você é um assistente especializado em TypeScript e Node.js.');
history.addMessage({ role: 'user', content: 'Como implementar uma interface em TypeScript?' });
history.addMessage({ id: 'msg-custom', role: 'assistant', content: 'Use: interface Nome { propriedade: tipo; }' });

console.log('📋 Histórico Inicial:');
history.exportHistory().forEach((msg, i) => {
    console.log(`   ${i + 1}. [${msg.role}] ID: ${msg.id} - "${msg.content}"`);
});

// ========================================
// 1. editMessage() - Editar mensagem específica
// ========================================
console.log('\n=== 1. editMessage() ===');
console.log('Usado para corrigir ou otimizar mensagens específicas.');

try {
    const userMessage = history.getMessageById('msg-custom');
    if (userMessage && userMessage.id) {
        console.log(`Antes: "${userMessage.content}"`);
        
        history.editMessage(userMessage.id, 'interface Nome { propriedade: tipo; método(): void; }');
        
        const editedMessage = history.getMessageById(userMessage.id);
        console.log(`Depois: "${editedMessage?.content}"`);
        console.log('Status: ✅ Mensagem editada com sucesso');
    } else {
        console.log('Status: ❌ Mensagem não encontrada');
    }
} catch (error) {
    console.log(`Status: ❌ Erro ao editar - ${error.message}`);
}

// ========================================
// 2. getMessageById() - Buscar mensagem por ID
// ========================================
console.log('\n=== 2. getMessageById() ===');
console.log('Usado para encontrar mensagens específicas no histórico.');

const testCases = ['msg-custom', 'inexistente'];

testCases.forEach(id => {
    const message = history.getMessageById(id);
    if (message) {
        console.log(`ID "${id}": Encontrada - "${message.content}"`);
    } else {
        console.log(`ID "${id}": Não encontrada`);
    }
});

// ========================================
// 3. deleteMessageRange() - Remover range de mensagens
// ========================================
console.log('\n=== 3. deleteMessageRange() ===');
console.log('Usado para remover seções do histórico.');

// Adicionar mais mensagens
const additionalMessages: Message[] = [
    { id: 'extra-0', role: 'user', content: 'E como implementar classes?' },
    { id: 'extra-1', role: 'assistant', content: 'Classes usam a palavra-chave class' },
    { id: 'extra-2', role: 'user', content: 'Qual a diferença entre interface e type?' },
    { id: 'extra-3', role: 'assistant', content: 'Interfaces são para contratos, types para union' }
];

additionalMessages.forEach((msg) => {
    history.addMessage(msg);
});

console.log(`Antes da remoção: ${history.exportHistory().length} mensagens`);

try {
    const allMessages = history.exportHistory();
    const startId = 'extra-1';
    const endId = 'extra-2';
    
    // Verificar se os IDs existem
    const startExists = allMessages.some(msg => msg.id === startId);
    const endExists = allMessages.some(msg => msg.id === endId);
    
    if (startExists && endExists) {
        history.deleteMessageRange(startId, endId);
        console.log(`Após remoção: ${history.exportHistory().length} mensagens`);
        console.log('Status: ✅ Range removido com sucesso');
    } else {
        console.log('Status: ❌ IDs não encontrados');
    }
} catch (error) {
    console.log(`Status: ❌ Erro ao remover - ${error.message}`);
}

// ========================================
// 4. exportHistory() - Exportar histórico completo
// ========================================
console.log('\n=== 4. exportHistory() ===');
console.log('Usado para backup, análise ou transferência de contexto.');

try {
    const exportedHistory = history.exportHistory();
    
    console.log(`Total exportado: ${exportedHistory.length} mensagens`);
    console.log('Estrutura exportada:');
    exportedHistory.forEach((msg, i) => {
        console.log(`   ${i + 1}. { id: "${msg.id}", role: "${msg.role}", content: "${msg.content}" }`);
    });
    
    const jsonBackup = JSON.stringify(exportedHistory, null, 2);
    console.log(`\nJSON para backup: ${jsonBackup.length} caracteres`);
    console.log('Status: ✅ Histórico exportado com sucesso');
} catch (error) {
    console.log(`Status: ❌ Erro ao exportar - ${error.message}`);
}

// ========================================
// 5. importHistory() - Importar mensagens
// ========================================
console.log('\n=== 5. importHistory() ===');
console.log('Usado para restaurar backups, migrar contexto ou combinar históricos.');

try {
    const newHistory: Message[] = [
        { id: 'import-1', role: 'system', content: 'Novo system prompt para teste' },
        { role: 'user', content: 'Mensagem sem ID (ID será gerado automaticamente)' },
        { id: 'import-3', role: 'assistant', content: 'Resposta do assistente importada' }
    ];
    
    console.log('Importando novo histórico...');
    history.importHistory(newHistory);
    
    const importedMessages = history.exportHistory();
    console.log(`Total após importação: ${importedMessages.length} mensagens`);
    
    // Verificar se ID foi gerado para mensagem sem ID
    const messageWithoutOriginalId = importedMessages.find(msg => msg.content.includes('sem ID'));
    console.log(`ID gerado automaticamente: ${messageWithoutOriginalId?.id}`);
    
    console.log('Status: ✅ Histórico importado com sucesso');
} catch (error) {
    console.log(`Status: ❌ Erro ao importar - ${error.message}`);
}

// ========================================
// 6. Validação e Tratamento de Erros
// ========================================
console.log('\n=== 6. Validação e Tratamento de Erros ===');
console.log('Os métodos incluem validação robusta e mensagens de erro claras.');

try {
    history.editMessage('id-inexistente', 'conteúdo');
    console.log('❌ Falha: Deveria lançar erro');
} catch (error) {
    console.log('✅ Sucesso: Erro lançado corretamente - ' + error.message);
}

try {
    history.deleteMessageRange('start-invalido', 'end-invalido');
    console.log('❌ Falha: Deveria lançar erro');
} catch (error) {
    console.log('✅ Sucesso: Erro lançado corretamente - ' + error.message);
}

try {
    // @ts-ignore - Teste intencional
    history.importHistory(null as any);
    console.log('❌ Falha: Deveria lançar erro');
} catch (error) {
    console.log('✅ Sucesso: Erro lançado corretamente - ' + error.message);
}

// ========================================
// 7. Melhores Práticas
// ========================================
console.log('\n=== 7. Melhores Práticas ===');
console.log(`
✅ SEMPRE verifique se a mensagem existe antes de editar
✅ Use IDs descritivos para facilitar busca
✅ Faça backup antes de grandes modificações
✅ Valide o array antes de importar
✅ Monitore o uso de tokens após operações
✅ Documente suas estratégias personalizadas
✅ Teste edge cases em ambiente de desenvolvimento
`);

// ========================================
// 8. Casos de Uso Comuns
// ========================================
console.log('\n=== 8. Casos de Uso Comuns ===');

console.log(`
📝 Correção de erros:
editMessage(msgId, conteúdoCorrigido);

🗑️ Limpeza de conversa:
deleteMessageRange(startId, endId);

💾 Backup de sessão:
const backup = exportHistory();
localStorage.setItem('chat-backup', JSON.stringify(backup));

🔄 Migração de contexto:
const oldContext = oldManager.exportHistory();
newManager.importHistory(oldContext);

📊 Análise de conversa:
const messages = exportHistory();
const userMessages = messages.filter(m => m.role === 'user');

🎯 Busca rápida:
const importantMsg = getMessageById('msg-chave');
`);

// Estado final
console.log('\n=== Estado Final da Demonstração ===');
const finalMessages = history.exportHistory();
const finalBudget = history.getRemainingBudget();

console.log(`📊 Resumo Final:`);
console.log(`   • Mensagens no histórico: ${finalMessages.length}`);
console.log(`   • Tokens restantes: ${finalBudget}`);
console.log(`   • IDs únicos: ${new Set(finalMessages.map(m => m.id)).size}`);
console.log(`   • Roles presentes: ${[...new Set(finalMessages.map(m => m.role))].join(', ')}`);

console.log('\n=== Guia Concluído ===');
console.log('🎉 Todos os novos métodos foram demonstrados!');
console.log('Use estes exemplos como base para suas próprias implementações.');

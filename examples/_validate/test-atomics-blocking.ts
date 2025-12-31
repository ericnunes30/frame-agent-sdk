/**
 * Teste simples para verificar se Atomics.wait() bloqueia o event loop
 */

console.log('='.repeat(80));
console.log('TESTE: Verificando se Atomics.wait() bloqueia o event loop');
console.log('='.repeat(80));

console.log('\n[TESTE] Início do teste');

// Função de bloqueio síncrono
const blockingWait = (ms: number) => {
  console.log(`[blockingWait] Iniciando bloqueio de ${ms}ms`);
  const sharedBuffer = new SharedArrayBuffer(4);
  const int32 = new Int32Array(sharedBuffer);
  Atomics.wait(int32, 0, 0, ms);
  console.log(`[blockingWait] Bloqueio de ${ms}ms completado`);
};

// Teste 1: Verificar se o bloqueio funciona
console.log('\n--- Teste 1: Bloqueio de 2000ms ---');
const startTime1 = Date.now();
blockingWait(2000);
const endTime1 = Date.now();
const duration1 = endTime1 - startTime1;
console.log(`Duração: ${duration1}ms`);
console.log(duration1 >= 1900 && duration1 < 2100 ? '✅ Bloqueio funcionou' : '❌ Bloqueio falhou');

// Teste 2: Verificar se setTimeouts são bloqueados
console.log('\n--- Teste 2: Verificando se setTimeouts são bloqueados ---');
let timeoutExecuted = false;
setTimeout(() => {
  timeoutExecuted = true;
  console.log('[setTimeout] Este setTimeout foi executado!');
}, 1000);

console.log('[TESTE] Iniciando bloqueio de 3000ms...');
const startTime2 = Date.now();
blockingWait(3000);
const endTime2 = Date.now();
const duration2 = endTime2 - startTime2;
console.log(`[TESTE] Bloqueio completado em ${duration2}ms`);

setTimeout(() => {
  console.log(`[setTimeout após bloqueio] timeoutExecuted: ${timeoutExecuted}`);
  if (timeoutExecuted) {
    console.log('❌ FALHA: O setTimeout foi executado durante o bloqueio!');
    console.log('   Isso significa que Atomics.wait() NÃO bloqueia o event loop!');
  } else {
    console.log('✅ SUCESSO: O setTimeout NÃO foi executado durante o bloqueio!');
    console.log('   Isso significa que Atomics.wait() bloqueia o event loop!');
  }
}, 100);

// Teste 3: Verificar se Promises são bloqueadas
console.log('\n--- Teste 3: Verificando se Promises são bloqueadas ---');
let promiseExecuted = false;
Promise.resolve().then(() => {
  promiseExecuted = true;
  console.log('[Promise] Esta Promise foi executada!');
});

console.log('[TESTE] Iniciando bloqueio de 2000ms...');
const startTime3 = Date.now();
blockingWait(2000);
const endTime3 = Date.now();
const duration3 = endTime3 - startTime3;
console.log(`[TESTE] Bloqueio completado em ${duration3}ms`);

setTimeout(() => {
  console.log(`[Promise após bloqueio] promiseExecuted: ${promiseExecuted}`);
  if (promiseExecuted) {
    console.log('❌ FALHA: A Promise foi executada durante o bloqueio!');
    console.log('   Isso significa que Atomics.wait() NÃO bloqueia o event loop!');
  } else {
    console.log('✅ SUCESSO: A Promise NÃO foi executada durante o bloqueio!');
    console.log('   Isso significa que Atomics.wait() bloqueia o event loop!');
  }
}, 100);

console.log('\n[TESTE] Fim do teste (mas os callbacks ainda podem ser executados)');

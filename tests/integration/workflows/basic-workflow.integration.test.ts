import { WorkflowEngine } from '../../../src/orchestrators/workflows/core/WorkflowEngine';
import { WorkflowBuilder } from '../../../src/orchestrators/workflows/builder/WorkflowBuilder';
import { SyncStep } from '../../../src/orchestrators/workflows/steps/base/SyncStep';
import { AsyncStep } from '../../../src/orchestrators/workflows/steps/base/AsyncStep';
import { ConditionalStep } from '../../../src/orchestrators/workflows/steps/conditional/ConditionalStep';
import { IWorkflowContext, ICondition } from '../../../src/orchestrators/workflows/steps/interfaces';

describe('Basic Workflow Integration', () => {
  let engine: WorkflowEngine;

  beforeEach(() => {
    engine = new WorkflowEngine({
      enableLogging: false,
      timeout: 10000,
      maxRetries: 2,
      retryDelay: 100,
      enableParallelism: true,
      maxParallelSteps: 5
    });
  });

  describe('Basic Sequential Workflow', () => {
    it('should execute a simple sequential workflow', async () => {
      const steps = [
        new SyncStep('step1', (context) => {
          context.state.step1Result = 'Step 1 completed';
          return { status: 'success', data: 'Step 1 data' };
        }),
        new SyncStep('step2', (context) => {
          const step1Result = context.results.get('step1')?.data;
          context.state.step2Result = `Step 2 processed: ${step1Result.status}`;
          return { status: 'success', data: 'Step 2 data' };
        }, ['step1']),
        new SyncStep('step3', (context) => {
          const step2Result = context.results.get('step2')?.data;
          context.state.finalResult = `Final: ${step2Result.status}`;
          return { status: 'completed', data: 'Final result' };
        }, ['step2'])
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      expect(result.results.size).toBe(3);
      
      const step1Result = result.results.get('step1');
      expect(step1Result?.success).toBe(true);
      expect(step1Result?.data?.status).toBe('success');
      expect(step1Result?.data?.data).toBe('Step 1 data');

      const step2Result = result.results.get('step2');
      expect(step2Result?.success).toBe(true);
      expect(step2Result?.data?.status).toBe('success');
      expect(step2Result?.data?.data).toBe('Step 2 data');

      const step3Result = result.results.get('step3');
      expect(step3Result?.success).toBe(true);
      expect(step3Result?.data?.status).toBe('completed');
      expect(step3Result?.data?.data).toBe('Final result');
    });

    it('should maintain state across steps', async () => {
      const steps = [
        new SyncStep('initialize', (context) => {
          context.state.counter = 0;
          context.state.items = [];
          return 'initialized';
        }),
        new SyncStep('process1', (context) => {
          context.state.counter += 10;
          context.state.items.push('item1');
          return 'processed1';
        }, ['initialize']),
        new SyncStep('process2', (context) => {
          context.state.counter += 20;
          context.state.items.push('item2');
          return 'processed2';
        }, ['process1']),
        new SyncStep('finalize', (context) => {
          const total = context.state.counter;
          const items = context.state.items;
          return { total, items, count: items.length };
        }, ['process2'])
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      
      const finalResult = result.results.get('finalize')?.data;
      expect(finalResult.total).toBe(30);
      expect(finalResult.items).toEqual(['item1', 'item2']);
      expect(finalResult.count).toBe(2);
    });
  });

  describe('Basic Parallel Workflow', () => {
    it('should execute independent steps in parallel', async () => {
      const startTime = Date.now();

      const steps = [
        new AsyncStep('parallel1', async (context) => {
          await new Promise(resolve => setTimeout(resolve, 100));
          context.state.result1 = 'Parallel 1 done';
          return 'result1';
        }),
        new AsyncStep('parallel2', async (context) => {
          await new Promise(resolve => setTimeout(resolve, 100));
          context.state.result2 = 'Parallel 2 done';
          return 'result2';
        }),
        new AsyncStep('parallel3', async (context) => {
          await new Promise(resolve => setTimeout(resolve, 100));
          context.state.result3 = 'Parallel 3 done';
          return 'result3';
        }),
        new SyncStep('collector', (context) => {
          return {
            results: [context.state.result1, context.state.result2, context.state.result3],
            timestamp: Date.now()
          };
        }, ['parallel1', 'parallel2', 'parallel3'])
      ];

      const result = await engine.executeWorkflow(steps);
      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(executionTime).toBeLessThan(250); // Should be much faster than sequential (300ms)
      
      const collectorResult = result.results.get('collector')?.data;
      expect(collectorResult.results).toEqual([
        'Parallel 1 done',
        'Parallel 2 done', 
        'Parallel 3 done'
      ]);
    });

    it('should handle mixed sync and async steps', async () => {
      const steps = [
        new SyncStep('sync1', (context) => {
          context.state.sync1 = 'Sync 1 completed';
          return 'sync-result1';
        }),
        new AsyncStep('async1', async (context) => {
          await new Promise(resolve => setTimeout(resolve, 50));
          context.state.async1 = 'Async 1 completed';
          return 'async-result1';
        }),
        new SyncStep('sync2', (context) => {
          const sync1 = context.results.get('sync1')?.data;
          const async1 = context.results.get('async1')?.data;
          return `Combined: ${sync1} + ${async1}`;
        }, ['sync1', 'async1'])
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      
      const combinedResult = result.results.get('sync2')?.data;
      expect(combinedResult).toBe('Combined: sync-result1 + async-result1');
    });
  });

  describe('Basic Conditional Workflow', () => {
    it('should execute conditional logic', async () => {
      const conditions: ICondition[] = [
        {
          id: 'high-priority',
          output: 'high',
          priority: 1,
          evaluate: (context) => context.state.priority > 80
        },
        {
          id: 'medium-priority',
          output: 'medium',
          priority: 2,
          evaluate: (context) => context.state.priority > 50
        },
        {
          id: 'low-priority',
          output: 'low',
          priority: 3,
          evaluate: (context) => context.state.priority > 20
        }
      ];

      const steps = [
        new SyncStep('setup', (context) => {
          context.state.priority = 75;
          return 'priority-set';
        }),
        new ConditionalStep('priority-check', conditions, {
          defaultOutput: 'no-priority'
        }),
        new SyncStep('action', (context) => {
          const priorityResult = context.results.get('priority-check')?.data;
          return `Action taken for priority: ${priorityResult.output}`;
        }, ['priority-check'])
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      
      const actionResult = result.results.get('action')?.data;
      expect(actionResult).toBe('Action taken for priority: medium');
    });

    it('should use default output when no conditions match', async () => {
      const conditions: ICondition[] = [
        {
          id: 'condition1',
          output: 'output1',
          evaluate: () => false
        },
        {
          id: 'condition2',
          output: 'output2',
          evaluate: () => false
        }
      ];

      const steps = [
        new ConditionalStep('conditional-step', conditions, {
          defaultOutput: 'default-output'
        }),
        new SyncStep('follow-up', (context) => {
          const conditionalResult = context.results.get('conditional-step')?.data;
          return `Processed: ${conditionalResult.output}`;
        }, ['conditional-step'])
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      
      const followUpResult = result.results.get('follow-up')?.data;
      expect(followUpResult).toBe('Processed: default-output');
    });
  });

  describe('Error Handling', () => {
    it('should handle step failure gracefully', async () => {
      const steps = [
        new SyncStep('step1', (context) => {
          return 'success1';
        }),
        new SyncStep('failing-step', (context) => {
          throw new Error('Step execution failed');
        }),
        new SyncStep('step3', (context) => {
          return 'success3';
        }, ['failing-step']) // This should not execute
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(false);
      expect(result.results.get('step1')?.success).toBe(true);
      expect(result.results.get('failing-step')?.success).toBe(false);
      expect(result.results.get('failing-step')?.metadata?.errorMessage).toBe('Step execution failed');
      expect(result.results.get('step3')).toBeUndefined(); // Should not execute
    });

    it('should retry failed steps when configured', async () => {
      let attemptCount = 0;
      
      const steps = [
        new SyncStep('retry-step', (context) => {
          attemptCount++;
          if (attemptCount < 3) {
            throw new Error(`Attempt ${attemptCount} failed`);
          }
          return `Success after ${attemptCount} attempts`;
        })
      ];

      const result = await engine.executeWorkflow(steps, {}, {
        maxRetries: 3,
        retryDelay: 50
      });

      expect(result.success).toBe(true);
      expect(attemptCount).toBe(3);
      expect(result.results.get('retry-step')?.data).toBe('Success after 3 attempts');
    });
  });

  describe('Workflow Builder Pattern', () => {
    it('should create workflow using builder pattern', async () => {
      const result = await WorkflowBuilder.create()
        .addSyncStep('step1', (context) => {
          context.state.initialized = true;
          return 'initialized';
        })
        .addAsyncStep('step2', async (context) => {
          await new Promise(resolve => setTimeout(resolve, 50));
          return 'async-completed';
        }, ['step1'])
        .addSyncStep('step3', (context) => {
          const step1Result = context.results.get('step1')?.data;
          const step2Result = context.results.get('step2')?.data;
          return `Final: ${step1Result} + ${step2Result}`;
        }, ['step2'])
        .execute();

      expect(result.success).toBe(true);
      expect(result.results.size).toBe(3);
      
      const step3Result = result.results.get('step3')?.data;
      expect(step3Result).toBe('Final: initialized + async-completed');
    });

    it('should validate workflow before execution', async () => {
      const builder = WorkflowBuilder.create()
        .addSyncStep('step1', (context) => 'result1')
        .addSyncStep('step2', (context) => 'result2', ['nonexistent-step']);

      const validationErrors = builder.validate();
      expect(validationErrors).toContain("Step 'step2' depende de step inexistente: 'nonexistent-step'");
    });
  });

  describe('Performance and Timing', () => {
    it('should measure execution time accurately', async () => {
      const steps = [
        new AsyncStep('timing-step', async (context) => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return 'completed';
        })
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      expect(result.totalExecutionTime).toBeGreaterThanOrEqual(100);
      expect(result.totalExecutionTime).toBeLessThan(200); // Some margin
      
      const stepResult = result.results.get('timing-step');
      expect(stepResult?.metadata?.executionTime).toBeGreaterThanOrEqual(100);
    });

    it('should handle timeout configuration', async () => {
      const steps = [
        new AsyncStep('timeout-step', async (context) => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return 'completed';
        })
      ];

      const result = await engine.executeWorkflow(steps, {}, {
        timeout: 500 // Very short timeout
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    }, 10000);
  });

  describe('Real-world Data Processing', () => {
    it('should process user data workflow', async () => {
      const userData = {
        id: 123,
        name: 'John Doe',
        email: 'john@example.com',
        preferences: {
          newsletter: true,
          notifications: false
        }
      };

      const steps = [
        new SyncStep('validate-user', (context) => {
          const user = context.state.user;
          if (!user.name || !user.email) {
            throw new Error('Invalid user data');
          }
          return { valid: true, userId: user.id };
        }),
        new AsyncStep('fetch-additional-data', async (context) => {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 50));
          return {
            subscriptionStatus: 'active',
            lastLogin: new Date().toISOString()
          };
        }, ['validate-user']),
        new SyncStep('process-preferences', (context) => {
          const validationResult = context.results.get('validate-user')?.data;
          const additionalData = context.results.get('fetch-additional-data')?.data;
          
          return {
            userId: validationResult.userId,
            canSendNewsletter: context.state.user.preferences.newsletter,
            canSendNotifications: context.state.user.preferences.notifications,
            subscriptionActive: additionalData.subscriptionStatus === 'active'
          };
        }, ['fetch-additional-data']),
        new SyncStep('generate-response', (context) => {
          const processedData = context.results.get('process-preferences')?.data;
          
          return {
            success: true,
            userId: processedData.userId,
            message: 'User data processed successfully',
            canCommunicate: processedData.canSendNewsletter || processedData.canSendNotifications,
            subscriptionStatus: processedData.subscriptionActive ? 'active' : 'inactive'
          };
        }, ['process-preferences'])
      ];

      const result = await engine.executeWorkflow(steps, {
        state: { user: userData }
      });

      expect(result.success).toBe(true);
      
      const finalResult = result.results.get('generate-response')?.data;
      expect(finalResult.success).toBe(true);
      expect(finalResult.userId).toBe(123);
      expect(finalResult.canCommunicate).toBe(true);
      expect(finalResult.subscriptionStatus).toBe('active');
    });

    it('should handle data transformation pipeline', async () => {
      const inputData = {
        rawData: [1, 2, 3, 4, 5],
        metadata: { source: 'api', timestamp: Date.now() }
      };

      const steps = [
        new SyncStep('validate-input', (context) => {
          const data = context.state.inputData;
          if (!Array.isArray(data.rawData)) {
            throw new Error('Invalid input data format');
          }
          return { valid: true, itemCount: data.rawData.length };
        }),
        new AsyncStep('transform-data', async (context) => {
          const rawData = context.state.inputData.rawData;
          // Simulate async transformation
          await new Promise(resolve => setTimeout(resolve, 50));
          
          const transformed = rawData.map(item => ({
            original: item,
            doubled: item * 2,
            squared: item * item
          }));
          
          return { transformed, originalCount: rawData.length };
        }, ['validate-input']),
        new SyncStep('calculate-stats', (context) => {
          const transformedData = context.results.get('transform-data')?.data;
          const stats = {
            sum: transformedData.transformed.reduce((acc, item) => acc + item.original, 0),
            sumDoubled: transformedData.transformed.reduce((acc, item) => acc + item.doubled, 0),
            sumSquared: transformedData.transformed.reduce((acc, item) => acc + item.squared, 0)
          };
          
          return stats;
        }, ['transform-data']),
        new SyncStep('format-output', (context) => {
          const stats = context.results.get('calculate-stats')?.data;
          const transformed = context.results.get('transform-data')?.data;
          
          return {
            summary: {
              inputCount: transformed.originalCount,
              totalSum: stats.sum,
              totalDoubled: stats.sumDoubled,
              totalSquared: stats.sumSquared,
              efficiency: (stats.sumDoubled / stats.sum).toFixed(2)
            },
            details: transformed.transformed
          };
        }, ['calculate-stats'])
      ];

      const result = await engine.executeWorkflow(steps, {
        state: { inputData }
      });

      expect(result.success).toBe(true);
      
      const finalOutput = result.results.get('format-output')?.data;
      expect(finalOutput.summary.inputCount).toBe(5);
      expect(finalOutput.summary.totalSum).toBe(15);
      expect(finalOutput.summary.totalDoubled).toBe(30);
      expect(finalOutput.summary.totalSquared).toBe(55);
      expect(finalOutput.details).toHaveLength(5);
      expect(finalOutput.details[0]).toEqual({
        original: 1,
        doubled: 2,
        squared: 1
      });
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should handle partial failures gracefully', async () => {
      const steps = [
        new SyncStep('step1', (context) => {
          return { status: 'success', data: 'step1-data' };
        }),
        new SyncStep('step2', (context) => {
          // This step might fail
          if (Math.random() > 0.5) {
            throw new Error('Random failure');
          }
          return { status: 'success', data: 'step2-data' };
        }),
        new SyncStep('step3', (context) => {
          const step1Result = context.results.get('step1')?.data;
          const step2Result = context.results.get('step2');
          
          if (step2Result?.success) {
            return { status: 'success', combined: [step1Result.data, step2Result.data] };
          } else {
            return { status: 'partial', fallback: step1Result.data };
          }
        }, ['step1', 'step2'])
      ];

      const result = await engine.executeWorkflow(steps);

      // Should complete even if step2 fails
      expect(result.results.has('step1')).toBe(true);
      expect(result.results.has('step2')).toBe(true);
      expect(result.results.has('step3')).toBe(true);
      
      const step3Result = result.results.get('step3')?.data;
      expect(step3Result.status).toMatch(/success|partial/);
    });

    it('should validate workflow structure before execution', async () => {
      const steps = [
        new SyncStep('step1', (context) => 'result1'),
        new SyncStep('step2', (context) => 'result2', ['nonexistent-step']),
        new SyncStep('step3', (context) => 'result3', ['step1', 'step2'])
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('depende de step inexistente');
    });
  });
});
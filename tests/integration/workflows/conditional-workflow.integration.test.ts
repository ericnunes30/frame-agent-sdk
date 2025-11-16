import { WorkflowEngine } from '../../../src/orchestrators/workflows/core/WorkflowEngine';
import { WorkflowBuilder } from '../../../src/orchestrators/workflows/builder/WorkflowBuilder';
import { SyncStep } from '../../../src/orchestrators/workflows/steps/base/SyncStep';
import { AsyncStep } from '../../../src/orchestrators/workflows/steps/base/AsyncStep';
import { ConditionalStep } from '../../../src/orchestrators/workflows/steps/conditional/ConditionalStep';
import { IWorkflowContext, ICondition } from '../../../src/orchestrators/workflows/steps/interfaces';
import { UnconnectedOutputNotifier } from '../../../src/orchestrators/workflows/utils/UnconnectedOutputNotifier';

describe('Conditional Workflow Integration', () => {
  let engine: WorkflowEngine;

  beforeEach(() => {
    engine = new WorkflowEngine({
      enableLogging: false,
      timeout: 15000,
      maxRetries: 2,
      retryDelay: 100,
      enableParallelism: true,
      maxParallelSteps: 5
    });
  });

  describe('Simple Conditional Branching', () => {
    it('should execute different paths based on conditions', async () => {
      const conditions: ICondition[] = [
        {
          id: 'premium-user',
          output: 'premium',
          priority: 1,
          evaluate: (context) => context.state.userType === 'premium'
        },
        {
          id: 'standard-user',
          output: 'standard',
          priority: 2,
          evaluate: (context) => context.state.userType === 'standard'
        },
        {
          id: 'basic-user',
          output: 'basic',
          priority: 3,
          evaluate: (context) => context.state.userType === 'basic'
        }
      ];

      const testUserType = async (userType: string, expectedOutput: string) => {
        const steps = [
          new SyncStep('setup', (context) => {
            context.state.userType = userType;
            return `User type set to ${userType}`;
          }),
          new ConditionalStep('user-classification', conditions, {
            defaultOutput: 'guest'
          }),
          new SyncStep('process-user', (context) => {
            const classification = context.results.get('user-classification')?.data;
            return {
              userType,
              classification: classification.output,
              features: getFeaturesForClassification(classification.output)
            };
          }, ['user-classification'])
        ];

        const result = await engine.executeWorkflow(steps);
        
        expect(result.success).toBe(true);
        const processResult = result.results.get('process-user')?.data;
        expect(processResult.classification).toBe(expectedOutput);
      };

      await testUserType('premium', 'premium');
      await testUserType('standard', 'standard');
      await testUserType('basic', 'basic');
      await testUserType('unknown', 'guest');
    });

    it('should handle priority-based condition evaluation', async () => {
      const conditions: ICondition[] = [
        {
          id: 'critical-priority',
          output: 'critical',
          priority: 1,
          evaluate: (context) => context.state.priority >= 90
        },
        {
          id: 'high-priority',
          output: 'high',
          priority: 2,
          evaluate: (context) => context.state.priority >= 70
        },
        {
          id: 'medium-priority',
          output: 'medium',
          priority: 3,
          evaluate: (context) => context.state.priority >= 40
        },
        {
          id: 'low-priority',
          output: 'low',
          priority: 4,
          evaluate: (context) => context.state.priority >= 10
        }
      ];

      const testPriority = async (priority: number, expectedOutput: string) => {
        const steps = [
          new SyncStep('set-priority', (context) => {
            context.state.priority = priority;
            return `Priority set to ${priority}`;
          }),
          new ConditionalStep('priority-check', conditions),
          new SyncStep('handle-priority', (context) => {
            const priorityResult = context.results.get('priority-check')?.data;
            return {
              priority,
              level: priorityResult.output,
              responseTime: getResponseTimeForPriority(priorityResult.output),
              resources: getResourcesForPriority(priorityResult.output)
            };
          }, ['priority-check'])
        ];

        const result = await engine.executeWorkflow(steps);
        
        expect(result.success).toBe(true);
        const handleResult = result.results.get('handle-priority')?.data;
        expect(handleResult.level).toBe(expectedOutput);
      };

      await testPriority(95, 'critical');
      await testPriority(75, 'high');
      await testPriority(45, 'medium');
      await testPriority(15, 'low');
      await testPriority(5, null); // Should use default (null)
    });
  });

  describe('Complex Conditional Logic', () => {
    it('should handle nested conditional workflows', async () => {
      const userConditions: ICondition[] = [
        {
          id: 'authenticated',
          output: 'auth',
          evaluate: (context) => context.state.authenticated === true
        },
        {
          id: 'guest',
          output: 'guest',
          evaluate: (context) => context.state.authenticated === false
        }
      ];

      const authConditions: ICondition[] = [
        {
          id: 'admin-user',
          output: 'admin',
          priority: 1,
          evaluate: (context) => context.state.userRole === 'admin'
        },
        {
          id: 'power-user',
          output: 'power',
          priority: 2,
          evaluate: (context) => context.state.userRole === 'power'
        },
        {
          id: 'regular-user',
          output: 'regular',
          priority: 3,
          evaluate: (context) => context.state.userRole === 'regular'
        }
      ];

      const steps = [
        new SyncStep('setup-user', (context) => {
          context.state.authenticated = true;
          context.state.userRole = 'admin';
          context.state.userId = 123;
          return 'User setup complete';
        }),
        new ConditionalStep('auth-check', userConditions, { defaultOutput: 'unknown' }),
        
        // Branch for authenticated users
        new ConditionalStep('role-check', authConditions, { 
          defaultOutput: 'unauthorized' 
        }, ['auth-check']),
        
        new SyncStep('final-processing', (context) => {
          const authResult = context.results.get('auth-check')?.data;
          const roleResult = context.results.get('role-check')?.data;
          
          return {
            authentication: authResult.output,
            authorization: roleResult?.output || 'none',
            permissions: getPermissions(authResult.output, roleResult?.output),
            userId: context.state.userId
          };
        }, ['role-check'])
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      
      const finalResult = result.results.get('final-processing')?.data;
      expect(finalResult.authentication).toBe('auth');
      expect(finalResult.authorization).toBe('admin');
      expect(finalResult.permissions).toContain('admin');
      expect(finalResult.userId).toBe(123);
    });

    it('should handle conditional steps with async conditions', async () => {
      const asyncConditions: ICondition[] = [
        {
          id: 'api-available',
          output: 'online',
          priority: 1,
          evaluate: async (context) => {
            await new Promise(resolve => setTimeout(resolve, 50));
            return context.state.apiStatus === 'online';
          }
        },
        {
          id: 'cached-data',
          output: 'cached',
          priority: 2,
          evaluate: async (context) => {
            await new Promise(resolve => setTimeout(resolve, 30));
            return context.state.cacheValid === true;
          }
        },
        {
          id: 'offline-mode',
          output: 'offline',
          priority: 3,
          evaluate: async (context) => {
            await new Promise(resolve => setTimeout(resolve, 20));
            return context.state.offlineMode === true;
          }
        }
      ];

      const testScenario = async (scenario: any, expectedOutput: string) => {
        const steps = [
          new SyncStep('setup-scenario', (context) => {
            Object.assign(context.state, scenario);
            return 'Scenario configured';
          }),
          new ConditionalStep('connection-check', asyncConditions),
          new SyncStep('data-retrieval', (context) => {
            const connectionResult = context.results.get('connection-check')?.data;
            return {
              mode: connectionResult.output,
              dataSource: getDataSource(connectionResult.output),
              timestamp: new Date().toISOString()
            };
          }, ['connection-check'])
        ];

        const result = await engine.executeWorkflow(steps);
        
        expect(result.success).toBe(true);
        const retrievalResult = result.results.get('data-retrieval')?.data;
        expect(retrievalResult.mode).toBe(expectedOutput);
      };

      await testScenario(
        { apiStatus: 'online', cacheValid: true, offlineMode: false },
        'online'
      );

      await testScenario(
        { apiStatus: 'offline', cacheValid: true, offlineMode: false },
        'cached'
      );

      await testScenario(
        { apiStatus: 'offline', cacheValid: false, offlineMode: true },
        'offline'
      );
    });
  });

  describe('Unconnected Output Notifications', () => {
    it('should notify about unconnected outputs', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const conditions: ICondition[] = [
        {
          id: 'condition-a',
          output: 'output-a',
          evaluate: () => true
        },
        {
          id: 'condition-b',
          output: 'output-b',
          evaluate: () => false
        },
        {
          id: 'condition-c',
          output: 'output-c',
          evaluate: () => false
        }
      ];

      const steps = [
        new ConditionalStep('conditional-step', conditions, {
          defaultOutput: 'default-output'
        }),
        new SyncStep('follow-a', (context) => {
          const conditionalResult = context.results.get('conditional-step')?.data;
          return `Processed path A: ${conditionalResult.output}`;
        }, ['conditional-step'])
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[UnconnectedOutputNotifier] Saída não conectada detectada: output-b'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[UnconnectedOutputNotifier] Saída não conectada detectada: output-c'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[UnconnectedOutputNotifier] Saída não conectada detectada: default-output'
      );

      consoleSpy.mockRestore();
    });

    it('should handle custom unconnected output handlers', async () => {
      const notifications: string[] = [];
      
      const customNotifier = new UnconnectedOutputNotifier();
      customNotifier.addConfig('custom-output', {
        type: 'custom',
        customHandler: async (output: string, context: IWorkflowContext) => {
          notifications.push(output);
        },
        enabled: true
      });

      const conditions: ICondition[] = [
        {
          id: 'condition1',
          output: 'custom-output',
          evaluate: () => true
        }
      ];

      const steps = [
        new ConditionalStep('conditional-step', conditions, {
          unconnectedOutputNotifier: customNotifier
        })
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      expect(notifications).toContain('custom-output');
    });

    it('should handle multiple conditional steps with notifications', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const userConditions: ICondition[] = [
        { id: 'new-user', output: 'new', evaluate: () => true },
        { id: 'returning-user', output: 'returning', evaluate: () => false }
      ];

      const contentConditions: ICondition[] = [
        { id: 'premium-content', output: 'premium', evaluate: () => true },
        { id: 'free-content', output: 'free', evaluate: () => false }
      ];

      const steps = [
        new ConditionalStep('user-classification', userConditions),
        new ConditionalStep('content-classification', contentConditions),
        new SyncStep('final-decision', (context) => {
          const userType = context.results.get('user-classification')?.data;
          const contentType = context.results.get('content-classification')?.data;
          
          return {
            userType: userType.output,
            contentType: contentType.output,
            canAccess: userType.output === 'new' && contentType.output === 'premium'
          };
        }, ['user-classification', 'content-classification'])
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      
      // Should notify about unconnected outputs
      expect(consoleSpy).toHaveBeenCalledWith(
        '[UnconnectedOutputNotifier] Saída não conectada detectada: returning'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[UnconnectedOutputNotifier] Saída não conectada detectada: free'
      );

      const finalDecision = result.results.get('final-decision')?.data;
      expect(finalDecision.userType).toBe('new');
      expect(finalDecision.contentType).toBe('premium');
      expect(finalDecision.canAccess).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe('Conditional Workflow with Builder Pattern', () => {
    it('should create complex conditional workflow using builder', async () => {
      const result = await WorkflowBuilder.create()
        .addSyncStep('initialize', (context) => {
          context.state.user = {
            id: 456,
            type: 'premium',
            preferences: { newsletter: true, darkMode: true }
          };
          return 'initialized';
        })
        .addConditionalStep('user-type-check', [
          {
            id: 'premium-check',
            output: 'premium-user',
            evaluate: (context) => context.state.user.type === 'premium'
          },
          {
            id: 'standard-check',
            output: 'standard-user',
            evaluate: (context) => context.state.user.type === 'standard'
          }
        ])
        .connectOutput('user-type-check', 'premium-user', 'premium-processing')
        .connectOutput('user-type-check', 'standard-user', 'standard-processing')
        .addSyncStep('premium-processing', (context) => {
          return {
            features: ['advanced-analytics', 'priority-support', 'unlimited-storage'],
            userType: 'premium'
          };
        }, ['user-type-check'])
        .addSyncStep('standard-processing', (context) => {
          return {
            features: ['basic-analytics', 'email-support', 'limited-storage'],
            userType: 'standard'
          };
        }, ['user-type-check'])
        .addSyncStep('final-setup', (context) => {
          const userTypeResult = context.results.get('user-type-check')?.data;
          const processingResult = userTypeResult.output === 'premium-user' 
            ? context.results.get('premium-processing')?.data
            : context.results.get('standard-processing')?.data;
          
          return {
            userId: context.state.user.id,
            classification: processingResult.userType,
            availableFeatures: processingResult.features,
            setupComplete: true
          };
        }, ['premium-processing', 'standard-processing'])
        .execute();

      expect(result.success).toBe(true);
      
      const finalSetup = result.results.get('final-setup')?.data;
      expect(finalSetup.userId).toBe(456);
      expect(finalSetup.classification).toBe('premium');
      expect(finalSetup.availableFeatures).toContain('advanced-analytics');
      expect(finalSetup.availableFeatures).toContain('priority-support');
      expect(finalSetup.setupComplete).toBe(true);
    });

    it('should handle conditional workflows with parallel branches', async () => {
      const result = await WorkflowBuilder.create()
        .addSyncStep('setup-request', (context) => {
          context.state.request = {
            type: 'data-analysis',
            priority: 'high',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          };
          return 'request-setup-complete';
        })
        .addConditionalStep('request-type-check', [
          {
            id: 'data-analysis',
            output: 'data-analysis',
            evaluate: (context) => context.state.request.type === 'data-analysis'
          },
          {
            id: 'image-processing',
            output: 'image-processing',
            evaluate: (context) => context.state.request.type === 'image-processing'
          }
        ])
        .addAsyncStep('parallel-stats', async (context) => {
          const data = context.state.request.data;
          await new Promise(resolve => setTimeout(resolve, 50));
          
          return {
            mean: data.reduce((sum, val) => sum + val, 0) / data.length,
            min: Math.min(...data),
            max: Math.max(...data),
            count: data.length
          };
        }, ['request-type-check'])
        .addAsyncStep('parallel-transformations', async (context) => {
          const data = context.state.request.data;
          await new Promise(resolve => setTimeout(resolve, 75));
          
          return {
            doubled: data.map(x => x * 2),
            squared: data.map(x => x * x),
            normalized: data.map(x => x / Math.max(...data))
          };
        }, ['request-type-check'])
        .addAsyncStep('parallel-advanced-analysis', async (context) => {
          const data = context.state.request.data;
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const sorted = [...data].sort((a, b) => a - b);
          const median = sorted.length % 2 === 0 
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];
          
          const variance = data.reduce((sum, val) => sum + Math.pow(val - data.reduce((s, v) => s + v, 0) / data.length, 2), 0) / data.length;
          
          return {
            median,
            variance: variance.toFixed(2),
            standardDeviation: Math.sqrt(variance).toFixed(2),
            quartiles: {
              q1: sorted[Math.floor(sorted.length * 0.25)],
              q3: sorted[Math.floor(sorted.length * 0.75)]
            }
          };
        }, ['request-type-check'])
        .addSyncStep('compile-analysis', (context) => {
          const stats = context.results.get('parallel-stats')?.data;
          const transformations = context.results.get('parallel-transformations')?.data;
          const advanced = context.results.get('parallel-advanced-analysis')?.data;
          
          return {
            requestType: context.state.request.type,
            priority: context.state.request.priority,
            basicStats: stats,
            transformations: transformations,
            advancedStats: advanced,
            analysisComplete: true,
            timestamp: new Date().toISOString()
          };
        }, ['parallel-stats', 'parallel-transformations', 'parallel-advanced-analysis'])
        .execute();

      expect(result.success).toBe(true);
      
      const analysis = result.results.get('compile-analysis')?.data;
      expect(analysis.requestType).toBe('data-analysis');
      expect(analysis.priority).toBe('high');
      expect(analysis.basicStats.mean).toBe(5.5);
      expect(analysis.basicStats.min).toBe(1);
      expect(analysis.basicStats.max).toBe(10);
      expect(analysis.transformations.doubled).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
      expect(analysis.advancedStats.median).toBe(5.5);
      expect(analysis.analysisComplete).toBe(true);
    });
  });

  describe('Error Handling in Conditional Workflows', () => {
    it('should handle errors in condition evaluation gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const errorConditions: ICondition[] = [
        {
          id: 'failing-condition',
          output: 'error-output',
          priority: 1,
          evaluate: () => {
            throw new Error('Condition evaluation failed');
          }
        },
        {
          id: 'working-condition',
          output: 'success-output',
          priority: 2,
          evaluate: () => true
        }
      ];

      const steps = [
        new ConditionalStep('error-conditional', errorConditions),
        new SyncStep('recovery-step', (context) => {
          const conditionalResult = context.results.get('error-conditional')?.data;
          return {
            status: 'recovered',
            output: conditionalResult.output,
            message: 'Continued despite condition error'
          };
        }, ['error-conditional'])
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Condição failing-condition falhou durante avaliação:',
        expect.any(Error)
      );

      const recoveryResult = result.results.get('recovery-step')?.data;
      expect(recoveryResult.status).toBe('recovered');
      expect(recoveryResult.output).toBe('success-output');

      consoleSpy.mockRestore();
    });

    it('should handle all conditions failing', async () => {
      const failingConditions: ICondition[] = [
        {
          id: 'fail1',
          output: 'fail-output-1',
          evaluate: () => false
        },
        {
          id: 'fail2',
          output: 'fail-output-2',
          evaluate: () => {
            throw new Error('Condition 2 error');
          }
        },
        {
          id: 'fail3',
          output: 'fail-output-3',
          evaluate: () => false
        }
      ];

      const steps = [
        new ConditionalStep('all-fail-conditional', failingConditions, {
          defaultOutput: 'fallback-output'
        }),
        new SyncStep('fallback-step', (context) => {
          const conditionalResult = context.results.get('all-fail-conditional')?.data;
          return {
            status: 'fallback',
            output: conditionalResult.output,
            usedDefault: conditionalResult.usedDefaultOutput
          };
        }, ['all-fail-conditional'])
      ];

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      
      const fallbackResult = result.results.get('fallback-step')?.data;
      expect(fallbackResult.output).toBe('fallback-output');
      expect(fallbackResult.usedDefault).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle multiple conditional steps efficiently', async () => {
      const createConditionalStep = (id: string, conditionCount: number) => {
        const conditions: ICondition[] = Array.from({ length: conditionCount }, (_, i) => ({
          id: `${id}-condition-${i}`,
          output: `${id}-output-${i}`,
          priority: i + 1,
          evaluate: (context) => context.state[`${id}Value`] === i
        }));

        return new ConditionalStep(`${id}-conditional`, conditions);
      };

      const steps = [
        new SyncStep('setup', (context) => {
          for (let i = 1; i <= 5; i++) {
            context.state[`step${i}Value`] = i - 1; // Match first condition
          }
          return 'setup-complete';
        }),
        createConditionalStep('step1', 3),
        createConditionalStep('step2', 5),
        createConditionalStep('step3', 7),
        createConditionalStep('step4', 4),
        createConditionalStep('step5', 6),
        new SyncStep('final-compilation', (context) => {
          const results = [];
          for (let i = 1; i <= 5; i++) {
            const result = context.results.get(`step${i}-conditional`)?.data;
            results.push({
              step: i,
              output: result.output,
              conditionMet: result.conditionMet
            });
          }
          return {
            totalConditionals: 5,
            results: results,
            allConditionsMet: results.every(r => r.conditionMet === true)
          };
        }, ['step1-conditional', 'step2-conditional', 'step3-conditional', 'step4-conditional', 'step5-conditional'])
      ];

      const startTime = Date.now();
      const result = await engine.executeWorkflow(steps);
      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(executionTime).toBeLessThan(1000); // Should handle multiple conditionals efficiently

      const compilation = result.results.get('final-compilation')?.data;
      expect(compilation.totalConditionals).toBe(5);
      expect(compilation.allConditionsMet).toBe(true);
      expect(compilation.results).toHaveLength(5);
    });

    it('should demonstrate performance with conditional parallel execution', async () => {
      const conditions: ICondition[] = [
        {
          id: 'parallel-path',
          output: 'parallel',
          evaluate: (context) => context.state.executionMode === 'parallel'
        },
        {
          id: 'sequential-path',
          output: 'sequential',
          evaluate: (context) => context.state.executionMode === 'sequential'
        }
      ];

      const createProcessingSteps = (mode: string, count: number) => {
        return Array.from({ length: count }, (_, i) =>
          mode === 'parallel' 
            ? new AsyncStep(`${mode}-step-${i}`, async (context) => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return { step: i, mode, completed: true };
              })
            : new SyncStep(`${mode}-step-${i}`, (context) => {
                // Simulate sequential processing
                const start = Date.now();
                while (Date.now() - start < 100) {
                  // Busy wait
                }
                return { step: i, mode, completed: true };
              })
        );
      };

      // Test parallel execution
      const parallelSteps = [
        new SyncStep('setup-parallel', (context) => {
          context.state.executionMode = 'parallel';
          return 'parallel-mode';
        }),
        new ConditionalStep('execution-mode', conditions),
        ...createProcessingSteps('parallel', 5),
        new SyncStep('parallel-summary', (context) => {
          const results = Array.from({ length: 5 }, (_, i) =>
            context.results.get(`parallel-step-${i}`)?.data
          );
          return {
            mode: 'parallel',
            steps: results.length,
            totalTime: Math.max(...results.map(r => r.processingTime || 100)),
            completed: results.every(r => r.completed)
          };
        }, Array.from({ length: 5 }, (_, i) => `parallel-step-${i}`))
      ];

      const startTime = Date.now();
      const parallelResult = await engine.executeWorkflow(parallelSteps);
      const parallelTime = Date.now() - startTime;

      expect(parallelResult.success).toBe(true);
      
      const parallelSummary = parallelResult.results.get('parallel-summary')?.data;
      expect(parallelSummary.mode).toBe('parallel');
      expect(parallelSummary.steps).toBe(5);
      expect(parallelSummary.completed).toBe(true);
      
      // Parallel execution should be much faster than sequential
      expect(parallelTime).toBeLessThan(300); // Should be ~100ms, not ~500ms
    });
  });
});

// Helper functions
function getFeaturesForClassification(classification: string): string[] {
  const features = {
    premium: ['advanced-analytics', 'priority-support', 'unlimited-storage', 'custom-themes'],
    standard: ['basic-analytics', 'email-support', 'limited-storage', 'standard-themes'],
    basic: ['minimal-analytics', 'community-support', 'basic-storage', 'basic-themes'],
    guest: ['view-only', 'no-support', 'minimal-storage', 'default-theme']
  };
  return features[classification] || features.guest;
}

function getResponseTimeForPriority(priority: string): number {
  const responseTimes = {
    critical: 100,
    high: 500,
    medium: 2000,
    low: 5000
  };
  return responseTimes[priority] || 10000;
}

function getResourcesForPriority(priority: string): string[] {
  const resources = {
    critical: ['dedicated-server', 'priority-queue', '24-7-support'],
    high: ['high-performance', 'priority-queue', 'business-hours-support'],
    medium: ['standard-server', 'normal-queue', 'business-hours-support'],
    low: ['shared-server', 'background-queue', 'community-support']
  };
  return resources[priority] || ['minimal-resources'];
}

function getDataSource(connectionType: string): string {
  const sources = {
    online: 'Live API',
    cached: 'Local Cache',
    offline: 'Offline Storage'
  };
  return sources[connectionType] || 'Unknown Source';
}

function getPermissions(auth: string, role?: string): string[] {
  if (auth !== 'auth') return ['none'];
  
  const permissions = {
    admin: ['read', 'write', 'delete', 'manage-users', 'system-settings'],
    power: ['read', 'write', 'delete', 'manage-content'],
    regular: ['read', 'write'],
    unauthorized: ['read-only']
  };
  
  return permissions[role] || permissions.unauthorized;
}
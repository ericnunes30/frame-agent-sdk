import { WorkflowEngine } from '../../../src/orchestrators/workflows/core/WorkflowEngine';
import { WorkflowBuilder } from '../../../src/orchestrators/workflows/builder/WorkflowBuilder';
import { SyncStep } from '../../../src/orchestrators/workflows/steps/base/SyncStep';
import { AsyncStep } from '../../../src/orchestrators/workflows/steps/base/AsyncStep';
import { ConditionalStep } from '../../../src/orchestrators/workflows/steps/conditional/ConditionalStep';
import { IWorkflowContext, ICondition } from '../../../src/orchestrators/workflows/steps/interfaces';

describe('Parallel Workflow Integration', () => {
  let engine: WorkflowEngine;

  beforeEach(() => {
    engine = new WorkflowEngine({
      enableLogging: false,
      timeout: 30000,
      maxRetries: 1,
      retryDelay: 100,
      enableParallelism: true,
      maxParallelSteps: 10
    });
  });

  describe('Parallel Data Processing', () => {
    it('should process multiple data sources in parallel', async () => {
      const startTime = Date.now();

      const steps = [
        new AsyncStep('fetch-user-data', async (context) => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return {
            userId: 123,
            name: 'John Doe',
            email: 'john@example.com'
          };
        }),
        new AsyncStep('fetch-order-data', async (context) => {
          await new Promise(resolve => setTimeout(resolve, 120));
          return {
            orders: [
              { id: 1, total: 100.50, date: '2024-01-01' },
              { id: 2, total: 75.25, date: '2024-01-15' }
            ],
            totalSpent: 175.75
          };
        }),
        new AsyncStep('fetch-preferences', async (context) => {
          await new Promise(resolve => setTimeout(resolve, 80));
          return {
            newsletter: true,
            notifications: false,
            language: 'en',
            theme: 'dark'
          };
        }),
        new AsyncStep('fetch-analytics', async (context) => {
          await new Promise(resolve => setTimeout(resolve, 150));
          return {
            lastLogin: '2024-01-20T10:30:00Z',
            loginCount: 45,
            averageSessionTime: 1200
          };
        }),
        new SyncStep('combine-data', (context) => {
          const userData = context.results.get('fetch-user-data')?.data;
          const orderData = context.results.get('fetch-order-data')?.data;
          const preferences = context.results.get('fetch-preferences')?.data;
          const analytics = context.results.get('fetch-analytics')?.data;

          return {
            user: userData,
            orders: orderData,
            preferences: preferences,
            analytics: analytics,
            profileComplete: !!(userData && orderData && preferences && analytics)
          };
        }, ['fetch-user-data', 'fetch-order-data', 'fetch-preferences', 'fetch-analytics'])
      ];

      const result = await engine.executeWorkflow(steps);
      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      // Should execute in parallel, taking ~150ms instead of ~450ms
      expect(executionTime).toBeLessThan(300);

      const combinedData = result.results.get('combine-data')?.data;
      expect(combinedData.profileComplete).toBe(true);
      expect(combinedData.user.name).toBe('John Doe');
      expect(combinedData.orders.totalSpent).toBe(175.75);
      expect(combinedData.preferences.newsletter).toBe(true);
      expect(combinedData.analytics.loginCount).toBe(45);
    });

    it('should handle parallel API calls with different response times', async () => {
      const apiCall = (delay: number, data: any) => 
        new AsyncStep(`api-${delay}ms`, async (context) => {
          await new Promise(resolve => setTimeout(resolve, delay));
          return { ...data, responseTime: delay, timestamp: Date.now() };
        });

      const steps = [
        apiCall(50, { endpoint: 'fast-api', data: 'quick-response' }),
        apiCall(200, { endpoint: 'slow-api', data: 'detailed-response' }),
        apiCall(100, { endpoint: 'medium-api', data: 'balanced-response' }),
        apiCall(25, { endpoint: 'instant-api', data: 'immediate-response' }),
        new SyncStep('aggregate-responses', (context) => {
          const responses = [
            context.results.get('api-50ms')?.data,
            context.results.get('api-200ms')?.data,
            context.results.get('api-100ms')?.data,
            context.results.get('api-25ms')?.data
          ];

          return {
            totalResponses: responses.length,
            fastest: Math.min(...responses.map(r => r.responseTime)),
            slowest: Math.max(...responses.map(r => r.responseTime)),
            endpoints: responses.map(r => r.endpoint),
            data: responses
          };
        }, ['api-50ms', 'api-200ms', 'api-100ms', 'api-25ms'])
      ];

      const startTime = Date.now();
      const result = await engine.executeWorkflow(steps);
      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(executionTime).toBeLessThan(250); // Should be ~200ms (slowest API)

      const aggregated = result.results.get('aggregate-responses')?.data;
      expect(aggregated.totalResponses).toBe(4);
      expect(aggregated.fastest).toBe(25);
      expect(aggregated.slowest).toBe(200);
      expect(aggregated.endpoints).toContain('instant-api');
      expect(aggregated.endpoints).toContain('slow-api');
    });
  });

  describe('Parallel File Processing', () => {
    it('should simulate parallel file processing', async () => {
      const files = [
        { name: 'document1.pdf', size: 1024, type: 'pdf' },
        { name: 'image1.jpg', size: 2048, type: 'image' },
        { name: 'data1.csv', size: 512, type: 'csv' },
        { name: 'video1.mp4', size: 4096, type: 'video' }
      ];

      const steps = files.map((file, index) => 
        new AsyncStep(`process-${file.name}`, async (context) => {
          const processingTime = file.size / 10; // Simulate processing time based on size
          await new Promise(resolve => setTimeout(resolve, processingTime));
          
          return {
            file: file.name,
            originalSize: file.size,
            processedSize: Math.floor(file.size * 0.7), // Simulate 30% compression
            processingTime: processingTime,
            status: 'processed',
            timestamp: Date.now()
          };
        })
      );

      steps.push(
        new SyncStep('generate-report', (context) => {
          const results = files.map(file => 
            context.results.get(`process-${file.name}`)?.data
          );

          const totalOriginalSize = results.reduce((sum, result) => sum + result.originalSize, 0);
          const totalProcessedSize = results.reduce((sum, result) => sum + result.processedSize, 0);
          const totalProcessingTime = results.reduce((sum, result) => sum + result.processingTime, 0);

          return {
            summary: {
              filesProcessed: results.length,
              totalOriginalSize,
              totalProcessedSize,
              compressionRatio: (totalProcessedSize / totalOriginalSize).toFixed(2),
              totalProcessingTime,
              averageProcessingTime: totalProcessingTime / results.length
            },
            details: results
          };
        }, files.map(file => `process-${file.name}`))
      );

      const startTime = Date.now();
      const result = await engine.executeWorkflow(steps);
      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(executionTime).toBeLessThan(500); // Should process in parallel

      const report = result.results.get('generate-report')?.data;
      expect(report.summary.filesProcessed).toBe(4);
      expect(report.summary.totalOriginalSize).toBe(7680);
      expect(report.summary.totalProcessedSize).toBe(5376);
      expect(report.details).toHaveLength(4);
    });
  });

  describe('Parallel Database Operations', () => {
    it('should simulate parallel database queries', async () => {
      const simulateQuery = (table: string, delay: number, recordCount: number) =>
        new AsyncStep(`query-${table}`, async (context) => {
          await new Promise(resolve => setTimeout(resolve, delay));
          
          const records = Array.from({ length: recordCount }, (_, i) => ({
            id: i + 1,
            table,
            data: `record-${i + 1}`,
            timestamp: Date.now()
          }));

          return {
            table,
            recordCount,
            queryTime: delay,
            records,
            completedAt: new Date().toISOString()
          };
        });

      const steps = [
        simulateQuery('users', 100, 50),
        simulateQuery('orders', 150, 200),
        simulateQuery('products', 80, 100),
        simulateQuery('analytics', 200, 1000),
        new SyncStep('compile-results', (context) => {
          const queries = ['users', 'orders', 'products', 'analytics'];
          const results = queries.map(table => 
            context.results.get(`query-${table}`)?.data
          );

          const totalRecords = results.reduce((sum, result) => sum + result.recordCount, 0);
          const totalQueryTime = Math.max(...results.map(r => r.queryTime));
          const averageQueryTime = results.reduce((sum, r) => sum + r.queryTime, 0) / results.length;

          return {
            summary: {
              totalRecords,
              totalQueryTime,
              averageQueryTime,
              queriesExecuted: results.length,
              tables: results.map(r => r.table)
            },
            queryResults: results
          };
        }, ['users', 'orders', 'products', 'analytics'].map(q => `query-${q}`))
      ];

      const startTime = Date.now();
      const result = await engine.executeWorkflow(steps);
      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(executionTime).toBeLessThan(250); // Should be ~200ms (slowest query)

      const compiled = result.results.get('compile-results')?.data;
      expect(compiled.summary.totalRecords).toBe(1350);
      expect(compiled.summary.queriesExecuted).toBe(4);
      expect(compiled.summary.tables).toContain('users');
      expect(compiled.summary.tables).toContain('analytics');
    });
  });

  describe('Parallel Computation', () => {
    it('should perform parallel mathematical computations', async () => {
      const heavyComputation = (name: string, complexity: number) =>
        new AsyncStep(`compute-${name}`, async (context) => {
          const startTime = Date.now();
          
          // Simulate heavy computation
          let result = 0;
          for (let i = 0; i < complexity * 100000; i++) {
            result += Math.sqrt(i) * Math.sin(i / 1000);
          }

          const computationTime = Date.now() - startTime;

          return {
            name,
            complexity,
            result: Math.floor(result),
            computationTime,
            completedAt: new Date().toISOString()
          };
        });

      const steps = [
        heavyComputation('fibonacci', 50),
        heavyComputation('prime-numbers', 75),
        heavyComputation('factorial', 30),
        heavyComputation('matrix-multiplication', 100),
        new SyncStep('aggregate-computations', (context) => {
          const computations = ['fibonacci', 'prime-numbers', 'factorial', 'matrix-multiplication'];
          const results = computations.map(name => 
            context.results.get(`compute-${name}`)?.data
          );

          const totalComputationTime = results.reduce((sum, result) => sum + result.computationTime, 0);
          const maxComputationTime = Math.max(...results.map(r => r.computationTime));

          return {
            summary: {
              totalComputations: results.length,
              totalComputationTime,
              maxComputationTime,
              averageComputationTime: totalComputationTime / results.length,
              totalComplexity: results.reduce((sum, r) => sum + r.complexity, 0)
            },
            computationResults: results
          };
        }, ['fibonacci', 'prime-numbers', 'factorial', 'matrix-multiplication'].map(c => `compute-${c}`))
      ];

      const startTime = Date.now();
      const result = await engine.executeWorkflow(steps);
      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      // Should be much faster than sequential execution
      expect(executionTime).toBeLessThan(5000);

      const aggregated = result.results.get('aggregate-computations')?.data;
      expect(aggregated.summary.totalComputations).toBe(4);
      expect(aggregated.computationResults).toHaveLength(4);
      expect(aggregated.summary.totalComplexity).toBe(255);
    });
  });

  describe('Parallel Web Scraping', () => {
    it('should simulate parallel web scraping', async () => {
      const scrapeWebsite = (name: string, delay: number, contentType: string) =>
        new AsyncStep(`scrape-${name}`, async (context) => {
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Simulate different content types
          const content = {
            articles: Array.from({ length: Math.floor(delay / 20) }, (_, i) => ({
              title: `${contentType} Article ${i + 1}`,
              url: `https://${name}.com/article-${i + 1}`,
              wordCount: Math.floor(Math.random() * 1000) + 500
            })),
            metadata: {
              site: name,
              scrapeTime: delay,
              contentType,
              scrapedAt: new Date().toISOString()
            }
          };

          return content;
        });

      const websites = [
        { name: 'news-site', delay: 120, type: 'news' },
        { name: 'blog-site', delay: 80, type: 'blog' },
        { name: 'forum-site', delay: 200, type: 'forum' },
        { name: 'shop-site', delay: 150, type: 'ecommerce' }
      ];

      const steps = websites.map(site => 
        scrapeWebsite(site.name, site.delay, site.type)
      );

      steps.push(
        new SyncStep('compile-scraped-data', (context) => {
          const scrapedData = websites.map(site => ({
            site: site.name,
            data: context.results.get(`scrape-${site.name}`)?.data
          }));

          const totalArticles = scrapedData.reduce((sum, site) => 
            sum + (site.data?.articles?.length || 0), 0
          );

          const totalWordCount = scrapedData.reduce((sum, site) => {
            const siteWords = site.data?.articles?.reduce((words, article) => 
              words + article.wordCount, 0) || 0;
            return sum + siteWords;
          }, 0);

          return {
            summary: {
              totalSites: scrapedData.length,
              totalArticles,
              totalWordCount,
              averageWordsPerArticle: totalArticles > 0 ? Math.floor(totalWordCount / totalArticles) : 0
            },
            sites: scrapedData
          };
        }, websites.map(w => `scrape-${w.name}`))
      );

      const startTime = Date.now();
      const result = await engine.executeWorkflow(steps);
      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(executionTime).toBeLessThan(250); // Should be ~200ms (slowest site)

      const compiled = result.results.get('compile-scraped-data')?.data;
      expect(compiled.summary.totalSites).toBe(4);
      expect(compiled.sites).toHaveLength(4);
      expect(compiled.summary.totalArticles).toBeGreaterThan(0);
    });
  });

  describe('Parallel Workflow with Conditional Logic', () => {
    it('should handle parallel execution with conditional branching', async () => {
      const conditions: ICondition[] = [
        {
          id: 'fast-path',
          output: 'fast',
          priority: 1,
          evaluate: (context) => context.state.priority === 'high'
        },
        {
          id: 'balanced-path',
          output: 'balanced',
          priority: 2,
          evaluate: (context) => context.state.priority === 'medium'
        },
        {
          id: 'thorough-path',
          output: 'thorough',
          priority: 3,
          evaluate: (context) => context.state.priority === 'low'
        }
      ];

      const steps = [
        new SyncStep('setup', (context) => {
          context.state.priority = 'high';
          context.state.data = { items: [1, 2, 3, 4, 5] };
          return 'setup-complete';
        }),
        new ConditionalStep('routing', conditions, { defaultOutput: 'default' }),
        new AsyncStep('parallel-processing-fast', async (context) => {
          const items = context.state.data.items;
          await new Promise(resolve => setTimeout(resolve, 50));
          return items.map(item => item * 2);
        }, ['routing']),
        new AsyncStep('parallel-processing-balanced', async (context) => {
          const items = context.state.data.items;
          await new Promise(resolve => setTimeout(resolve, 100));
          return items.map(item => ({ original: item, doubled: item * 2, tripled: item * 3 }));
        }, ['routing']),
        new AsyncStep('parallel-processing-thorough', async (context) => {
          const items = context.state.data.items;
          await new Promise(resolve => setTimeout(resolve, 150));
          return items.map(item => ({
            original: item,
            operations: {
              double: item * 2,
              triple: item * 3,
              square: item * item,
              factorial: item <= 4 ? [1, 2, 6, 24][item - 1] : 120
            }
          }));
        }, ['routing']),
        new SyncStep('collect-results', (context) => {
          const routingResult = context.results.get('routing')?.data;
          const fastResult = context.results.get('parallel-processing-fast')?.data;
          const balancedResult = context.results.get('parallel-processing-balanced')?.data;
          const thoroughResult = context.results.get('parallel-processing-thorough')?.data;

          return {
            routing: routingResult.output,
            results: {
              fast: fastResult,
              balanced: balancedResult,
              thorough: thoroughResult
            },
            selectedPath: routingResult.output
          };
        }, ['parallel-processing-fast', 'parallel-processing-balanced', 'parallel-processing-thorough'])
      ];

      const result = await engine.executeWorkflow(steps);

      expect(result.success).toBe(true);
      
      const collectResult = result.results.get('collect-results')?.data;
      expect(collectResult.routing).toBe('fast');
      expect(collectResult.selectedPath).toBe('fast');
      expect(collectResult.results.fast).toEqual([2, 4, 6, 8, 10]);
    });
  });

  describe('Performance and Optimization', () => {
    it('should demonstrate performance gains with parallelism', async () => {
      const createProcessingStep = (id: string, delay: number, complexity: number) =>
        new AsyncStep(id, async (context) => {
          const startTime = Date.now();
          
          // Simulate processing
          let result = 0;
          for (let i = 0; i < complexity * 10000; i++) {
            result += Math.sqrt(i) * Math.sin(i / 1000);
          }

          await new Promise(resolve => setTimeout(resolve, delay));
          
          return {
            id,
            delay,
            complexity,
            result: Math.floor(result),
            processingTime: Date.now() - startTime
          };
        });

      // Create 10 processing steps with different complexities
      const processingSteps = Array.from({ length: 10 }, (_, i) => 
        createProcessingStep(
          `process-${i}`,
          50 + (i * 10), // Different delays
          10 + (i * 5)   // Different complexities
        )
      );

      const steps = [
        ...processingSteps,
        new SyncStep('performance-analysis', (context) => {
          const results = processingSteps.map(step => 
            context.results.get(step.id)?.data
          );

          const totalProcessingTime = results.reduce((sum, result) => 
            sum + result.processingTime, 0
          );
          const maxProcessingTime = Math.max(...results.map(r => r.processingTime));

          return {
            totalSteps: results.length,
            totalProcessingTime,
            maxProcessingTime,
            averageProcessingTime: totalProcessingTime / results.length,
            efficiency: (maxProcessingTime / totalProcessingTime).toFixed(2)
          };
        }, processingSteps.map(s => s.id))
      ];

      const startTime = Date.now();
      const result = await engine.executeWorkflow(steps);
      const totalExecutionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      
      // Should be much faster than sequential execution
      const analysis = result.results.get('performance-analysis')?.data;
      expect(analysis.totalSteps).toBe(10);
      expect(analysis.efficiency).toBeLessThan(0.5); // Should show significant parallelism
      expect(totalExecutionTime).toBeLessThan(2000); // Should complete reasonably fast
    });

    it('should handle large number of parallel steps efficiently', async () => {
      const stepCount = 50;
      
      const steps = Array.from({ length: stepCount }, (_, i) =>
        new AsyncStep(`parallel-step-${i}`, async (context) => {
          await new Promise(resolve => setTimeout(resolve, 10));
          return {
            stepId: i,
            processed: true,
            timestamp: Date.now()
          };
        })
      );

      steps.push(
        new SyncStep('final-aggregation', (context) => {
          const results = Array.from({ length: stepCount }, (_, i) =>
            context.results.get(`parallel-step-${i}`)?.data
          );

          return {
            totalStepsProcessed: results.length,
            allSuccessful: results.every(r => r.processed === true),
            firstTimestamp: Math.min(...results.map(r => r.timestamp)),
            lastTimestamp: Math.max(...results.map(r => r.timestamp)),
            processingSpread: Math.max(...results.map(r => r.timestamp)) - 
                              Math.min(...results.map(r => r.timestamp))
          };
        }, Array.from({ length: stepCount }, (_, i) => `parallel-step-${i}`))
      );

      const startTime = Date.now();
      const result = await engine.executeWorkflow(steps);
      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(executionTime).toBeLessThan(1000); // Should handle 50 parallel steps efficiently

      const aggregation = result.results.get('final-aggregation')?.data;
      expect(aggregation.totalStepsProcessed).toBe(50);
      expect(aggregation.allSuccessful).toBe(true);
      expect(aggregation.processingSpread).toBeLessThan(100); // Should complete within tight timeframe
    });
  });
});
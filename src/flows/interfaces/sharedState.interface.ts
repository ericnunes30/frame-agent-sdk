export interface SharedState {
  plan?: Array<{ id: string; description: string; status: 'pending' | 'in_progress' | 'completed' | 'failed' }>;
  timeline?: Array<{ timestamp: string; type: string; data?: Record<string, unknown> }>;
  artifacts?: Array<{ name: string; type: 'file' | 'url' | 'json' | string; value: string; metadata?: Record<string, unknown> }>;
  decisions?: Array<{ id: string; description: string; result: string; data?: Record<string, unknown> }>;
  facts?: Record<string, unknown>;
}

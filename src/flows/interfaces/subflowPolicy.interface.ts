export interface SubflowPolicy {
  allowTools?: string[];
  denyTools?: string[];
  maxSteps?: number;
  timeoutMs?: number;
}

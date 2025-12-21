import type { SharedState } from '@/flows/interfaces/sharedState.interface';
import type { SharedPatch } from '@/flows/interfaces/sharedPatch.interface';

export type MapIn = (parent: { shared: SharedState; input: Record<string, unknown> }) => {
  childShared: SharedState;
  childInput: Record<string, unknown>;
};

export type MapOut = (result: { shared: SharedState; patch: SharedPatch[] }) => {
  nextShared: SharedState;
  patch: SharedPatch[];
};

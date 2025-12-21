export interface SharedPatch {
  op: 'set' | 'merge' | 'append';
  path: string;
  value: unknown;
}

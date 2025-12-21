import type { SharedPatch } from '@/flows/interfaces/sharedPatch.interface';
import type { SharedState } from '@/flows/interfaces/sharedState.interface';
import { cloneShared } from '@/flows/utils/sharedClone';

const BLOCKED_SEGMENTS = new Set(['__proto__', 'prototype', 'constructor']);

export function applySharedPatch(shared: SharedState, patch: SharedPatch[] = []): SharedState {
  let nextShared = cloneShared(shared ?? {});

  for (const item of patch) {
    validatePatch(item);
    applyPatch(nextShared, item);
  }

  return nextShared;
}

function validatePatch(patch: SharedPatch): void {
  if (!patch || typeof patch !== 'object') {
    throw new Error('SharedPatch must be an object');
  }

  if (!patch.op) {
    throw new Error('SharedPatch op is required');
  }

  if (patch.path === undefined || patch.path === null || String(patch.path).trim() === '') {
    throw new Error('SharedPatch path is required');
  }

  if (patch.op !== 'set' && patch.op !== 'merge' && patch.op !== 'append') {
    throw new Error(`SharedPatch op '${patch.op}' is not supported`);
  }
}

function applyPatch(shared: SharedState, patch: SharedPatch): SharedState {
  const next = shared;
  const segments = parsePath(patch.path);

  let cursor: any = next;
  for (let i = 0; i < segments.length - 1; i += 1) {
    const seg = segments[i];
    const key = isIndex(seg) ? Number(seg) : seg;
    const nextSeg = segments[i + 1];
    const nextIsIndex = isIndex(nextSeg);

    const current = cursor[key];
    if (current === undefined || current === null || typeof current !== 'object') {
      cursor[key] = nextIsIndex ? [] : {};
    } else if (Array.isArray(current) && !nextIsIndex) {
      // keep existing array
    } else if (!Array.isArray(current) && nextIsIndex) {
      cursor[key] = [];
    }

    cursor = cursor[key];
  }

  const lastSeg = segments[segments.length - 1];
  const lastKey = isIndex(lastSeg) ? Number(lastSeg) : lastSeg;

  switch (patch.op) {
    case 'set':
      setValue(cursor, lastKey, patch.value);
      break;
    case 'merge':
      mergeValue(cursor, lastKey, patch.value);
      break;
    case 'append':
      appendValue(cursor, lastKey, patch.value);
      break;
  }

  return next;
}

function parsePath(path: string): string[] {
  const segments = String(path).split('.');
  if (segments.length === 0) {
    throw new Error('SharedPatch path is invalid');
  }

  for (const seg of segments) {
    if (!seg || seg === '.' || seg === '..') {
      throw new Error(`SharedPatch path segment '${seg}' is invalid`);
    }
    if (BLOCKED_SEGMENTS.has(seg)) {
      throw new Error(`SharedPatch path segment '${seg}' is not allowed`);
    }
  }

  return segments;
}

function isIndex(segment: string): boolean {
  return /^\d+$/.test(segment);
}

function setValue(target: any, key: string | number, value: unknown): void {
  if (Array.isArray(target) && typeof key === 'number' && key >= target.length) {
    target.length = key + 1;
  }
  target[key] = value;
}

function mergeValue(target: any, key: string | number, value: unknown): void {
  const existing = target[key];
  if (isPlainObject(existing) && isPlainObject(value)) {
    target[key] = deepMerge(existing, value);
    return;
  }

  target[key] = value;
}

function appendValue(target: any, key: string | number, value: unknown): void {
  if (target[key] === undefined) {
    target[key] = [];
  }

  if (!Array.isArray(target[key])) {
    throw new Error('SharedPatch append target is not an array');
  }

  target[key].push(value);
}

function deepMerge(base: Record<string, unknown>, value: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = { ...base };

  for (const [key, val] of Object.entries(value)) {
    if (isPlainObject(val) && isPlainObject(output[key])) {
      output[key] = deepMerge(output[key] as Record<string, unknown>, val);
    } else {
      output[key] = val;
    }
  }

  return output;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  return Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null;
}

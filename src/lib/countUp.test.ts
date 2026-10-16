import { describe, expect, it } from 'vitest';
import { metricAt } from './countUp';

describe('metricAt', () => {
  it('counts a whole number up from zero and keeps its suffix', () => {
    expect(metricAt('96%', 0)).toBe('0%');
    expect(metricAt('96%', 0.5)).toBe('48%');
    expect(metricAt('96%', 1)).toBe('96%');
    expect(metricAt('119', 0.5)).toBe('60');
  });

  it('animates a before→after change from the before value', () => {
    expect(metricAt('2.3→0.9ms', 0)).toBe('2.3→2.3ms');
    expect(metricAt('2.3→0.9ms', 0.5)).toBe('2.3→1.6ms');
    expect(metricAt('2.3→0.9ms', 1)).toBe('2.3→0.9ms');
  });

  it('keeps the target’s decimal places', () => {
    expect(metricAt('3.60s', 0.5)).toBe('1.80s');
  });

  it('clamps progress outside 0..1', () => {
    expect(metricAt('8', -1)).toBe('0');
    expect(metricAt('8', 2)).toBe('8');
  });

  it('leaves text without numbers alone', () => {
    expect(metricAt('Now', 0.3)).toBe('Now');
  });
});

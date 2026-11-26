import { describe, expect, it } from 'vitest';
import { PROJECT_SLUGS, WORK_SLUGS } from '@/i18n/routes';
import { getProject, getWork, PROFILE, PROJECTS, SERVICES, WORKS } from '@/content';

const ALLOWED_METRIC_VALUES = new Set(['134', '574', '86.9', '3', '99.5', '9.36', '185']);

function localizedFields(obj: unknown, path = ''): Array<[string, { en: unknown; sr: unknown }]> {
  if (!obj || typeof obj !== 'object') return [];
  const rec = obj as Record<string, unknown>;
  if ('en' in rec && 'sr' in rec && Object.keys(rec).length === 2) return [[path, rec as { en: unknown; sr: unknown }]];
  return Object.entries(rec).flatMap(([k, v]) => localizedFields(v, `${path}.${k}`));
}

describe('content', () => {
  it('has every work and project slug exactly once', () => {
    expect(WORKS.map((w) => w.slug).sort()).toEqual([...WORK_SLUGS].sort());
    expect(PROJECTS.map((p) => p.slug).sort()).toEqual([...PROJECT_SLUGS].sort());
  });

  it('features only Uslužionica, first', () => {
    expect(WORKS.filter((w) => w.featured).map((w) => w.slug)).toEqual(['usluzionica']);
    expect(WORKS[0].slug).toBe('usluzionica');
  });

  it('uses only real metrics with matching ghost digits', () => {
    const metrics = [...WORKS.flatMap((w) => w.metrics), ...PROJECTS.flatMap((p) => p.metrics)];
    expect(metrics.length).toBeGreaterThan(0);
    for (const m of metrics) {
      expect(ALLOWED_METRIC_VALUES.has(m.value), m.value).toBe(true);
      expect(m.ghost.length, m.value).toBe(m.value.length);
      expect(m.ghost).toMatch(/^[8.]+$/);
    }
  });

  it('lists Uslužionica metrics exactly', () => {
    expect(getWork('usluzionica')?.metrics.map((m) => [m.value, m.caption])).toEqual([
      ['134', 'REST ENDPOINTS'],
      ['574', 'AUTOMATED TESTS'],
      ['86.9', '% LINE COVERAGE'],
      ['3', 'PLATFORMS'],
    ]);
  });

  it('fills both languages everywhere', () => {
    const fields = localizedFields({ SERVICES, WORKS, PROJECTS, PROFILE });
    expect(fields.length).toBeGreaterThan(40);
    for (const [path, v] of fields) {
      expect(JSON.stringify(v.en).length, `${path}.en`).toBeGreaterThan(2);
      expect(JSON.stringify(v.sr).length, `${path}.sr`).toBeGreaterThan(2);
    }
  });

  it('orders services W, A, M, B, E', () => {
    expect(SERVICES.map((s) => s.letter).join('')).toBe('WAMBE');
  });

  it('never publishes a phone number', () => {
    expect(JSON.stringify({ PROFILE, WORKS, PROJECTS })).not.toContain('+381');
  });

  it('looks items up by slug', () => {
    expect(getWork('kaneko')?.domain).toBe('kaneko-eeu.com');
    expect(getProject('connect-4')?.name).toBe('Connect 4 AI');
    expect(getWork('nope')).toBeUndefined();
  });
});

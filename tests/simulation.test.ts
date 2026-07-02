import { sampleTwin } from '../src/domain/sample';
import { mostExpensiveWorkflows, runScenario, workflowHours } from '../src/domain/simulation';
import { describe, expect, it } from 'vitest';

describe('business twin simulation', () => {
  it('calculates workflow hours', () => {
    expect(workflowHours(sampleTwin.workflows[0])).toBe(80);
  });

  it('ranks expensive workflows', () => {
    const ranked = mostExpensiveWorkflows(sampleTwin);
    expect(ranked[0].annualCost).toBeGreaterThanOrEqual(ranked[1].annualCost);
  });

  it('runs capacity scenario', () => {
    const result = runScenario(sampleTwin, 'capacity question', {
      type: 'capacity_loss',
      role: 'Recruiter',
      peopleLost: 3,
    });
    expect(result.impactScore).toBeGreaterThan(0);
    expect(result.findings.length).toBeGreaterThan(0);
  });

  it('runs automation scenario', () => {
    const result = runScenario(sampleTwin, 'automation question', {
      type: 'automation',
      workflowId: 'wf-reporting',
      automationLevel: 0.7,
    });
    expect(result.summary).toContain('save');
  });
});

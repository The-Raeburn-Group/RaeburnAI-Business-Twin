import type { BusinessTwin, Scenario, ScenarioResult, Workflow } from './types';

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

export function workflowHours(workflow: Workflow): number {
  return (workflow.weeklyVolume * workflow.minutesPerUnit) / 60;
}

export function workflowAnnualCost(twin: BusinessTwin, workflow: Workflow): number {
  const roles = twin.roles.filter((role) => workflow.requiredRoleIds.includes(role.id));
  const capacity = roles.reduce(
    (sum, role) => sum + role.capacityHoursPerWeek * Math.max(role.headcount, 1),
    0,
  );
  const cost = roles.reduce(
    (sum, role) => sum + role.costPerYear * Math.max(role.headcount, 1),
    0,
  );
  if (capacity === 0) return 0;
  return workflowHours(workflow) * 52 * (cost / (capacity * 52));
}

export function mostExpensiveWorkflows(twin: BusinessTwin) {
  return twin.workflows
    .map((workflow) => ({ workflow, annualCost: workflowAnnualCost(twin, workflow) }))
    .sort((a, b) => b.annualCost - a.annualCost);
}

export function runScenario(twin: BusinessTwin, question: string, scenario: Scenario): ScenarioResult {
  if (scenario.type === 'capacity_loss') {
    return capacityChange(twin, question, scenario.role, scenario.peopleLost);
  }
  if (scenario.type === 'workflow_volume_change') {
    return volumeChange(twin, question, scenario.workflowId, scenario.percentageChange);
  }
  return automationChange(twin, question, scenario.workflowId, scenario.automationLevel);
}

function capacityChange(
  twin: BusinessTwin,
  question: string,
  roleTitle: string,
  people: number,
): ScenarioResult {
  const roles = twin.roles.filter((role) =>
    role.title.toLowerCase().includes(roleTitle.toLowerCase()),
  );
  const weeklyHours = roles.reduce(
    (sum, role) => sum + role.capacityHoursPerWeek * Math.min(role.headcount, people),
    0,
  );
  const workflows = twin.workflows.filter((workflow) =>
    workflow.requiredRoleIds.some((id) => roles.some((role) => role.id === id)),
  );
  const workload = workflows.reduce((sum, workflow) => sum + workflowHours(workflow), 0);
  const impactScore = Math.min(100, Math.round((weeklyHours / Math.max(workload, 1)) * 100));

  return {
    question,
    summary: `${people} ${roleTitle} change affects about ${weeklyHours.toFixed(1)} weekly hours across ${workflows.length} workflows.`,
    impactScore,
    findings: [
      {
        label: 'Weekly capacity affected',
        value: `${weeklyHours.toFixed(1)} hours`,
        severity: impactScore > 50 ? 'high' : 'medium',
      },
      {
        label: 'Related workflows',
        value: String(workflows.length),
        severity: workflows.length > 3 ? 'high' : 'medium',
      },
      {
        label: 'Largest workflow',
        value: mostExpensiveWorkflows({ ...twin, workflows })[0]?.workflow.name ?? 'None',
        severity: 'medium',
      },
    ],
    recommendations: [
      'Cross-train adjacent roles.',
      'Prioritise high-volume workflow automation.',
      'Create a temporary capacity plan.',
    ],
  };
}

function volumeChange(
  twin: BusinessTwin,
  question: string,
  workflowId: string,
  percentageChange: number,
): ScenarioResult {
  const workflow = twin.workflows.find((item) => item.id === workflowId);
  if (!workflow) throw new Error('Workflow not found');
  const current = workflowHours(workflow);
  const next = current * (1 + percentageChange / 100);
  const impactScore = Math.min(100, Math.round(Math.abs(percentageChange)));

  return {
    question,
    summary: `${workflow.name} changes by ${percentageChange}% and moves from ${current.toFixed(1)} to ${next.toFixed(1)} weekly hours.`,
    impactScore,
    findings: [
      { label: 'Current weekly effort', value: `${current.toFixed(1)} hours`, severity: 'low' },
      {
        label: 'New weekly effort',
        value: `${next.toFixed(1)} hours`,
        severity: impactScore > 40 ? 'high' : 'medium',
      },
      {
        label: 'Annual workflow cost',
        value: gbp.format(workflowAnnualCost(twin, workflow)),
        severity: 'medium',
      },
    ],
    recommendations: ['Review demand, SLA risk and automation options before committing capacity.'],
  };
}

function automationChange(
  twin: BusinessTwin,
  question: string,
  workflowId: string,
  automationLevel: number,
): ScenarioResult {
  const workflow = twin.workflows.find((item) => item.id === workflowId);
  if (!workflow) throw new Error('Workflow not found');
  const level = Math.max(0, Math.min(1, automationLevel));
  const annualCost = workflowAnnualCost(twin, workflow);
  const saving = annualCost * level * workflow.automationPotential;

  return {
    question,
    summary: `${workflow.name} automation could save about ${gbp.format(saving)} per year.`,
    impactScore: Math.round(level * workflow.automationPotential * 100),
    findings: [
      { label: 'Current annual cost', value: gbp.format(annualCost), severity: 'medium' },
      {
        label: 'Potential annual saving',
        value: gbp.format(saving),
        severity: saving > 50000 ? 'high' : 'medium',
      },
      {
        label: 'Automation potential',
        value: `${(workflow.automationPotential * 100).toFixed(0)}%`,
        severity: workflow.automationPotential > 0.6 ? 'high' : 'medium',
      },
    ],
    recommendations: ['Run a pilot, track KPI uplift and keep human review for exceptions.'],
  };
}

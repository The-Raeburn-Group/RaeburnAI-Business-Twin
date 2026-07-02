import { z } from 'zod';

export const RoleSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  teamId: z.string(),
  headcount: z.number().int().nonnegative(),
  costPerYear: z.number().nonnegative(),
  capacityHoursPerWeek: z.number().nonnegative(),
  skills: z.array(z.string()).default([])
});

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  parentTeamId: z.string().optional(),
  leaderRoleId: z.string().optional()
});

export const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  ownerTeamId: z.string(),
  weeklyVolume: z.number().nonnegative(),
  minutesPerUnit: z.number().nonnegative(),
  requiredRoleIds: z.array(z.string()),
  toolNames: z.array(z.string()).default([]),
  automationPotential: z.number().min(0).max(1).default(0),
  businessCriticality: z.number().min(1).max(5).default(3)
});

export const KpiSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  ownerTeamId: z.string(),
  current: z.number(),
  target: z.number(),
  unit: z.string().default('')
});

export const BusinessTwinSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  teams: z.array(TeamSchema),
  roles: z.array(RoleSchema),
  workflows: z.array(WorkflowSchema),
  kpis: z.array(KpiSchema),
  sourceDocuments: z.array(z.object({ id: z.string(), name: z.string(), kind: z.string(), uploadedAt: z.string() })).default([])
});

export type Role = z.infer<typeof RoleSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;
export type Kpi = z.infer<typeof KpiSchema>;
export type BusinessTwin = z.infer<typeof BusinessTwinSchema>;

export type Scenario =
  | { type: 'capacity_loss'; role: string; peopleLost: number }
  | { type: 'workflow_volume_change'; workflowId: string; percentageChange: number }
  | { type: 'automation'; workflowId: string; automationLevel: number };

export type ScenarioResult = {
  question: string;
  summary: string;
  impactScore: number;
  findings: Array<{ label: string; value: string; severity: 'low' | 'medium' | 'high' }>;
  recommendations: string[];
};

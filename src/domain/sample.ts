import type { BusinessTwin } from './types';

export const sampleTwin: BusinessTwin = {
  id: 'demo-twin',
  name: 'Demo Recruitment Consultancy',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  teams: [
    { id: 'leadership', name: 'Leadership' },
    { id: 'delivery', name: 'Recruitment Delivery', parentTeamId: 'leadership' },
    { id: 'operations', name: 'Operations', parentTeamId: 'leadership' }
  ],
  roles: [
    { id: 'role-rec', title: 'Recruiter', teamId: 'delivery', headcount: 8, costPerYear: 42000, capacityHoursPerWeek: 32, skills: ['sourcing', 'screening'] },
    { id: 'role-am', title: 'Account Manager', teamId: 'delivery', headcount: 3, costPerYear: 52000, capacityHoursPerWeek: 30, skills: ['client management'] },
    { id: 'role-ops', title: 'Operations Analyst', teamId: 'operations', headcount: 2, costPerYear: 45000, capacityHoursPerWeek: 30, skills: ['reporting', 'process'] }
  ],
  workflows: [
    { id: 'wf-sourcing', name: 'Candidate sourcing', ownerTeamId: 'delivery', weeklyVolume: 600, minutesPerUnit: 8, requiredRoleIds: ['role-rec'], toolNames: ['LinkedIn', 'ATS'], automationPotential: 0.65, businessCriticality: 5 },
    { id: 'wf-screening', name: 'Candidate screening', ownerTeamId: 'delivery', weeklyVolume: 180, minutesPerUnit: 22, requiredRoleIds: ['role-rec'], toolNames: ['ATS'], automationPotential: 0.45, businessCriticality: 5 },
    { id: 'wf-reporting', name: 'Weekly client reporting', ownerTeamId: 'operations', weeklyVolume: 35, minutesPerUnit: 45, requiredRoleIds: ['role-ops', 'role-am'], toolNames: ['Sheets', 'CRM'], automationPotential: 0.8, businessCriticality: 4 }
  ],
  kpis: [
    { id: 'kpi-fill', name: 'Average time to shortlist', ownerTeamId: 'delivery', current: 5.2, target: 4, unit: 'days' },
    { id: 'kpi-margin', name: 'Gross margin', ownerTeamId: 'leadership', current: 32, target: 38, unit: '%' }
  ],
  sourceDocuments: []
};

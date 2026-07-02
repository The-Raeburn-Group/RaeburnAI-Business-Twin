import { sampleTwin } from '../domain/sample';
import { mostExpensiveWorkflows, runScenario, workflowHours } from '../domain/simulation';

export default function Home() {
  const expensive = mostExpensiveWorkflows(sampleTwin);
  const scenario = runScenario(sampleTwin, 'What happens if we lose 3 recruiters?', {
    type: 'capacity_loss',
    role: 'Recruiter',
    peopleLost: 3,
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12">
        <div className="rounded-3xl border border-blue-400/30 bg-white/5 p-8 shadow-2xl shadow-blue-950/40">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-300">RaeburnAI</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tight">
            Business Twin for operational intelligence
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            Upload policies, org charts, KPIs and process documents. Build a live model of how
            the business works, then simulate capacity, cost, workflow and automation decisions.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <Metric label="Teams" value={sampleTwin.teams.length} />
            <Metric label="Roles" value={sampleTwin.roles.length} />
            <Metric label="Workflows" value={sampleTwin.workflows.length} />
            <Metric label="KPIs" value={sampleTwin.kpis.length} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Scenario result" subtitle={scenario.summary}>
            <div className="text-6xl font-black text-blue-300">{scenario.impactScore}</div>
            <p className="text-slate-400">Impact score</p>
            <ul className="mt-6 space-y-3">
              {scenario.findings.map((item) => (
                <li key={item.label} className="rounded-2xl bg-slate-900 p-4">
                  <span className="text-slate-400">{item.label}</span>
                  <strong className="float-right">{item.value}</strong>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Most expensive workflows" subtitle="Ranked by role cost and weekly effort.">
            <div className="space-y-3">
              {expensive.map(({ workflow, annualCost }) => (
                <div key={workflow.id} className="rounded-2xl bg-slate-900 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{workflow.name}</h3>
                    <span className="text-blue-300">
                      £{Math.round(annualCost).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    {workflowHours(workflow).toFixed(1)} hours per week ·{' '}
                    {(workflow.automationPotential * 100).toFixed(0)}% automation potential
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-900 p-5">
      <div className="text-3xl font-bold text-blue-300">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-slate-400">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

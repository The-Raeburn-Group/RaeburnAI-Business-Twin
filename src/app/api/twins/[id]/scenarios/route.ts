import { z } from 'zod';
import { audit } from '../../../../../lib/audit';
import { requireApproval } from '../../../../../lib/approval';
import { fail, handleError, ok, parseJson } from '../../../../../lib/http';
import { checkRateLimit, getClientKey } from '../../../../../lib/rate-limit';
import { getTwin } from '../../../../../lib/store';
import { runScenario } from '../../../../../domain/simulation';

const Input = z.object({
  question: z.string().min(3).max(500),
  approved: z.boolean().optional(),
  scenario: z.union([
    z.object({ type: z.literal('capacity_loss'), role: z.string().min(1), peopleLost: z.number().int().positive().max(1000) }),
    z.object({ type: z.literal('workflow_volume_change'), workflowId: z.string().min(1), percentageChange: z.number().min(-100).max(1000) }),
    z.object({ type: z.literal('automation'), workflowId: z.string().min(1), automationLevel: z.number().min(0).max(1) }),
  ]),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Params) {
  try {
    const rate = checkRateLimit(getClientKey(request));
    if (!rate.allowed) return fail('Too many requests', 429, { retryAfterSeconds: rate.retryAfterSeconds });

    const params = await context.params;
    const twin = await getTwin(params.id);
    if (!twin) return fail('Twin not found', 404);

    const input = await parseJson(request, Input);
    requireApproval({ scenarioType: input.scenario.type, approved: input.approved, twinId: twin.id });
    const result = runScenario(twin, input.question, input.scenario);
    audit('scenario.run', twin.id, { scenarioType: input.scenario.type, impactScore: result.impactScore });
    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}

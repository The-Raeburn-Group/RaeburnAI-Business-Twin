import { z } from 'zod';
import { audit } from '../../../../../lib/audit';
import { authenticate, requireRole } from '../../../../../lib/auth';
import { fail, handleError, ok, parseJson } from '../../../../../lib/http';
import { checkRateLimit, getClientKey } from '../../../../../lib/rate-limit';
import { getTwin, saveTwin } from '../../../../../lib/store';

const Input = z.object({
  name: z.string().min(1).max(200),
  kind: z.enum(['policy', 'org_chart', 'kpi', 'process', 'other']),
  text: z.string().min(1).max(250000),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Params) {
  try {
    const auth = authenticate(request);
    if (!auth.ok) return auth.response;
    const forbidden = requireRole(auth.role, 'admin');
    if (forbidden) return forbidden;

    const rate = checkRateLimit(getClientKey(request));
    if (!rate.allowed) return fail('Too many requests', 429, { retryAfterSeconds: rate.retryAfterSeconds });
    const params = await context.params;
    const twin = await getTwin(params.id);
    if (!twin) return fail('Twin not found', 404);
    const input = await parseJson(request, Input);
    const document = {
      id: crypto.randomUUID(),
      name: input.name,
      kind: input.kind,
      uploadedAt: new Date().toISOString(),
    };
    const updated = await saveTwin({ ...twin, sourceDocuments: [...twin.sourceDocuments, document] });
    audit('document.register', twin.id, { documentId: document.id, kind: document.kind });
    return ok({ twin: updated, extracted: { note: 'Document registered for later enrichment.' } }, 201);
  } catch (error) {
    return handleError(error);
  }
}

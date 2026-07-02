import { z } from 'zod';
import { audit } from '../../../lib/audit';
import { authenticate, requireRole } from '../../../lib/auth';
import { fail, handleError, ok, parseJson } from '../../../lib/http';
import { checkRateLimit, getClientKey } from '../../../lib/rate-limit';
import { createTwin, listTwins } from '../../../lib/store';

const Input = z.object({ name: z.string().min(2).max(120) });

function enforceRateLimit(request: Request) {
  const result = checkRateLimit(getClientKey(request));
  if (!result.allowed) {
    return fail('Too many requests', 429, { retryAfterSeconds: result.retryAfterSeconds });
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const auth = authenticate(request);
    if (!auth.ok) return auth.response;
    const forbidden = requireRole(auth.role, 'viewer');
    if (forbidden) return forbidden;

    const limited = enforceRateLimit(request);
    if (limited) return limited;
    const twins = await listTwins();
    return ok(twins);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = authenticate(request);
    if (!auth.ok) return auth.response;
    const forbidden = requireRole(auth.role, 'admin');
    if (forbidden) return forbidden;

    const limited = enforceRateLimit(request);
    if (limited) return limited;
    const body = await parseJson(request, Input);
    const twin = await createTwin(body.name);
    audit('twin.create', twin.id, { name: twin.name });
    return ok(twin, 201);
  } catch (error) {
    return handleError(error);
  }
}

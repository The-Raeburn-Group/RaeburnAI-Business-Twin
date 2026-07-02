import { authenticate, requireRole } from '../../../../lib/auth';
import { fail, handleError, ok } from '../../../../lib/http';
import { getTwin } from '../../../../lib/store';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Params) {
  try {
    const auth = authenticate(request);
    if (!auth.ok) return auth.response;
    const forbidden = requireRole(auth.role, 'viewer');
    if (forbidden) return forbidden;
    const { id } = await context.params;
    const twin = await getTwin(id);
    if (!twin) return fail('Twin not found', 404);
    return ok(twin);
  } catch (error) {
    return handleError(error);
  }
}

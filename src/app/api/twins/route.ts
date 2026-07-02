import { z } from 'zod';
import { createTwin, listTwins } from '../../../lib/store';
import { handleError, ok, parseJson } from '../../../lib/http';

const Input = z.object({ name: z.string().min(2) });

export async function GET() {
  try {
    const twins = await listTwins();
    return ok(twins);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, Input);
    const twin = await createTwin(body.name);
    return ok(twin, 201);
  } catch (error) {
    return handleError(error);
  }
}

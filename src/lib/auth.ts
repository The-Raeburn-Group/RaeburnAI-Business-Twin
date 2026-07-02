import { fail } from './http';

export type Role = 'viewer' | 'analyst' | 'admin' | 'owner';

const roleRank: Record<Role, number> = {
  viewer: 1,
  analyst: 2,
  admin: 3,
  owner: 4,
};

function isRole(value: string): value is Role {
  return ['viewer', 'analyst', 'admin', 'owner'].includes(value);
}

export function authEnabled(): boolean {
  return process.env.RAEBURN_AUTH_ENABLED === 'true';
}

export function authenticate(request: Request): { ok: true; role: Role } | { ok: false; response: Response } {
  if (!authEnabled()) return { ok: true, role: 'owner' };

  const expectedToken = process.env.RAEBURN_API_TOKEN;
  if (!expectedToken) return { ok: false, response: fail('API authentication is not configured.', 500) };

  const header = request.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  if (token !== expectedToken) return { ok: false, response: fail('Unauthorised', 401) };

  const requestedRole = request.headers.get('x-raeburn-role') ?? 'viewer';
  const role = isRole(requestedRole) ? requestedRole : 'viewer';
  return { ok: true, role };
}

export function requireRole(role: Role, minimum: Role): Response | null {
  if (roleRank[role] >= roleRank[minimum]) return null;
  return fail('Forbidden', 403, { requiredRole: minimum });
}

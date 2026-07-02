import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { nanoid } from 'nanoid';
import { sampleTwin } from '../domain/sample';
import { BusinessTwinSchema, type BusinessTwin } from '../domain/types';

type StoreDriver = 'json' | 'postgres' | 'supabase';

const dataDir = process.env.RAEBURN_DATA_DIR ?? '.data';
const filePath = join(process.cwd(), dataDir, 'twins.json');

function driver(): StoreDriver {
  const value = process.env.RAEBURN_STORAGE_DRIVER ?? 'json';
  if (value === 'postgres' || value === 'supabase') return value;
  return 'json';
}

async function ensureJsonStore(): Promise<void> {
  await mkdir(join(process.cwd(), dataDir), { recursive: true });
  try {
    await readFile(filePath, 'utf8');
  } catch {
    await writeFile(filePath, JSON.stringify([sampleTwin], null, 2));
  }
}

async function requestDatabase<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const endpoint = process.env.RAEBURN_DATABASE_HTTP_URL;
  const token = process.env.RAEBURN_DATABASE_SERVICE_TOKEN;
  if (!endpoint || !token) {
    throw new Error('Database adapter requires RAEBURN_DATABASE_HTTP_URL and RAEBURN_DATABASE_SERVICE_TOKEN.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) throw new Error(`Database request failed with status ${response.status}.`);
  return (await response.json()) as T;
}

async function listJsonTwins(): Promise<BusinessTwin[]> {
  await ensureJsonStore();
  const raw = await readFile(filePath, 'utf8');
  return BusinessTwinSchema.array().parse(JSON.parse(raw));
}

async function saveJsonTwin(twin: BusinessTwin): Promise<BusinessTwin> {
  const twins = await listJsonTwins();
  const index = twins.findIndex((item) => item.id === twin.id);
  const updated = { ...twin, updatedAt: new Date().toISOString() };
  if (index >= 0) twins[index] = updated;
  else twins.push(updated);
  await writeFile(filePath, JSON.stringify(twins, null, 2));
  return updated;
}

export async function listTwins(): Promise<BusinessTwin[]> {
  if (driver() === 'json') return listJsonTwins();
  const result = await requestDatabase<{ data: unknown[] }>('select_twins');
  return BusinessTwinSchema.array().parse(result.data.map((row) => (typeof row === 'object' && row !== null && 'data' in row ? row.data : row)));
}

export async function getTwin(id: string): Promise<BusinessTwin | undefined> {
  if (driver() === 'json') return (await listJsonTwins()).find((twin) => twin.id === id);
  const result = await requestDatabase<{ data: unknown | null }>('get_twin', { id });
  if (!result.data) return undefined;
  return BusinessTwinSchema.parse(result.data);
}

export async function saveTwin(twin: BusinessTwin): Promise<BusinessTwin> {
  const updated = { ...twin, updatedAt: new Date().toISOString() };
  if (driver() === 'json') return saveJsonTwin(updated);
  const result = await requestDatabase<{ data: unknown }>('upsert_twin', { twin: updated });
  return BusinessTwinSchema.parse(result.data ?? updated);
}

export async function createTwin(name: string): Promise<BusinessTwin> {
  const now = new Date().toISOString();
  return saveTwin({
    id: nanoid(),
    name,
    createdAt: now,
    updatedAt: now,
    teams: [],
    roles: [],
    workflows: [],
    kpis: [],
    sourceDocuments: [],
  });
}

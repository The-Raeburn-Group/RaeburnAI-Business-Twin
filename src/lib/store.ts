import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { nanoid } from 'nanoid';
import { BusinessTwinSchema, type BusinessTwin } from '../domain/types';
import { sampleTwin } from '../domain/sample';

const dataDir = process.env.RAEBURN_DATA_DIR ?? '.data';
const filePath = join(process.cwd(), dataDir, 'twins.json');

async function ensureStore(): Promise<void> {
  await mkdir(join(process.cwd(), dataDir), { recursive: true });
  try {
    await readFile(filePath, 'utf8');
  } catch {
    await writeFile(filePath, JSON.stringify([sampleTwin], null, 2));
  }
}

export async function listTwins(): Promise<BusinessTwin[]> {
  await ensureStore();
  const raw = await readFile(filePath, 'utf8');
  return BusinessTwinSchema.array().parse(JSON.parse(raw));
}

export async function getTwin(id: string): Promise<BusinessTwin | undefined> {
  return (await listTwins()).find((twin) => twin.id === id);
}

export async function saveTwin(twin: BusinessTwin): Promise<BusinessTwin> {
  const twins = await listTwins();
  const index = twins.findIndex((item) => item.id === twin.id);
  const updated = { ...twin, updatedAt: new Date().toISOString() };
  if (index >= 0) twins[index] = updated;
  else twins.push(updated);
  await writeFile(filePath, JSON.stringify(twins, null, 2));
  return updated;
}

export async function createTwin(name: string): Promise<BusinessTwin> {
  const now = new Date().toISOString();
  return saveTwin({ id: nanoid(), name, createdAt: now, updatedAt: now, teams: [], roles: [], workflows: [], kpis: [], sourceDocuments: [] });
}

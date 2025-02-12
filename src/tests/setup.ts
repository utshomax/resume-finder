import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { resumes } from '../db/schema';


export const testPool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/resume_finder_test'
});

export const testDb = drizzle(testPool);

export async function setupTestDatabase() {
  await migrate(testDb as any, { migrationsFolder: './drizzle' });
}

export async function clearTestDatabase() {
  await testDb.delete(resumes);
}

export async function closeTestDatabase() {
  await testPool.end();
}

export function createTestResume(overrides = {}) {
  return {
    firstName: 'John',
    lastName: 'Doe',
    currentJobTitle: 'Software Engineer',
    currentJobDescription: 'Building awesome software',
    currentJobCompany: 'Tech Corp',
    ...overrides
  };
}
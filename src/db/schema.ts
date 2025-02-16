import { SQL, sql } from 'drizzle-orm';
import { pgTable, uuid, varchar, text, AnyPgColumn } from 'drizzle-orm/pg-core';

export const resumes = pgTable('resumes', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  currentJobTitle: varchar('current_job_title', { length: 200 }).notNull(),
  currentJobDescription: text('current_job_description').notNull(),
  currentJobCompany: varchar('current_job_company', { length: 200 }).notNull(),
});

// custom lower function
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
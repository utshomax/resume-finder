import { eq, or, and } from 'drizzle-orm';
import { db, resumes, type Resume, type NewResume } from '../db';

export class ResumeModel {
  static async create(resume: NewResume): Promise<Resume> {
    const [createdResume] = await db.insert(resumes).values(resume).returning();
    return createdResume;
  }

  static async findById(id: string): Promise<Resume | null> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume || null;
  }

  static async findByName(firstName: string, lastName: string): Promise<Resume[]> {
    // trying exact match first
    const exactMatches = await db
      .select()
      .from(resumes)
      .where(
        and(
          eq(resumes.firstName, firstName),
          eq(resumes.lastName, lastName)
        )
      );

    if (exactMatches.length > 0) {
      return exactMatches;
    }

    // if no exact matches, try partial matches
    const partialMatches = await db
      .select()
      .from(resumes)
      .where(
        or(
          eq(resumes.firstName, firstName),
          eq(resumes.lastName, lastName),
          eq(resumes.firstName, lastName),
          eq(resumes.lastName, firstName)
        )
      );

    return partialMatches;
  }
}
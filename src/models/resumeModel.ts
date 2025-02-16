import { eq, or, and } from 'drizzle-orm';
import { db, resumes, type Resume, type NewResume, lower } from '../db';

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
    if (!firstName && !lastName) {
      return [];
    }

    const lowerFirstName = firstName?.toLowerCase() || '';
    const lowerLastName = lastName?.toLowerCase() || '';

    // trying exact match first if both names are provided
    if (firstName && lastName) {
      const exactMatches = await db
        .select()
        .from(resumes)
        .where(
          and(
            eq(lower(resumes.firstName), lowerFirstName),
            eq(lower(resumes.lastName), lowerLastName)
          )
        );

      if (exactMatches.length > 0) {
        return exactMatches;
      }
    }

    // if no exact matches or only one name provided, try partial matches
    const conditions = [];
    if (firstName) {
      conditions.push(eq(lower(resumes.firstName), lowerFirstName));
      conditions.push(eq(lower(resumes.lastName), lowerFirstName));
    }
    if (lastName) {
      conditions.push(eq(lower(resumes.firstName), lowerLastName));
      conditions.push(eq(lower(resumes.lastName), lowerLastName));
    }

    const partialMatches = await db
      .select()
      .from(resumes)
      .where(or(...conditions));

    return partialMatches;
  }
}
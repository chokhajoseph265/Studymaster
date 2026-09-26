import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string) {
  try {
    const username = email ? email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_') : `student_${uid.slice(0, 6)}`;
    const studentName = name || username;

    const result = await db.insert(users)
      .values({
        id: uid,
        name: studentName,
        username: username,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          name: studentName,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database getOrCreateUser failed:', error);
    throw new Error('Database user operation failed. Please try again later.', { cause: error });
  }
}

export async function getUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error('Database query failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getUserById(id: string) {
  try {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  } catch (error) {
    console.error('Database getUserById failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

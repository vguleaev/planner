import { asc, eq } from 'drizzle-orm';
import type { UserType } from '@kinde-oss/kinde-typescript-sdk';
import { db } from '../db/db';
import { backlogTaskGroupTable } from '../db/schema';

export async function getGroups(user: UserType) {
  return await db
    .select()
    .from(backlogTaskGroupTable)
    .where(eq(backlogTaskGroupTable.userId, user.id))
    .orderBy(asc(backlogTaskGroupTable.createdAt));
}

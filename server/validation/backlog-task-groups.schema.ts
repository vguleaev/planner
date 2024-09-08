import z from 'zod';

export const createBacklogTaskGroupSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Title must be at least 2 characters' })
    .max(50, { message: 'Title must be at most 50 characters' }),
});

export type CreateBacklogTaskGroup = z.infer<typeof createBacklogTaskGroupSchema>;

export type UpdateBacklogTaskGroup = CreateBacklogTaskGroup;

export const updateBacklogTaskGroupSchema = createBacklogTaskGroupSchema;

import z from 'zod';
import { BACKLOG_TASK_STATUS } from '../constants/backlog-task-status.const';
import { BACKLOG_TASK_PRIORITY } from '../constants/backlog-task-priority.const';

export const createBacklogTaskSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Title must be at least 2 characters' })
    .max(50, { message: 'Title must be at most 50 characters' }),
  description: z.string().optional(),
  status: z.enum([BACKLOG_TASK_STATUS.NOT_COMPLETED, BACKLOG_TASK_STATUS.COMPLETED, BACKLOG_TASK_STATUS.WONT_DO]),
  priority: z.enum([BACKLOG_TASK_PRIORITY.LOW, BACKLOG_TASK_PRIORITY.MEDIUM, BACKLOG_TASK_PRIORITY.HIGH]),
  groupId: z.string(),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Date must be a valid ISO date',
    })
    .optional(),
});

export type CreateBacklogTask = z.infer<typeof createBacklogTaskSchema>;

import z from 'zod';
import { BACKLOG_TASK_STATUS } from '../constants/backlog-task-status.const';
import { BACKLOG_TASK_PRIORITY } from '../constants/backlog-task-priority.const';

export const createBacklogTaskSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Title must be at least 2 characters' })
    .max(50, { message: 'Title must be at most 50 characters' }),
  description: z.string().optional(),
  status: z.enum([BACKLOG_TASK_STATUS.NOT_COMPLETED, BACKLOG_TASK_STATUS.COMPLETED, BACKLOG_TASK_STATUS.WONT_DO], {
    message: 'Status must be selected',
  }),
  priority: z.enum([BACKLOG_TASK_PRIORITY.LOW, BACKLOG_TASK_PRIORITY.MEDIUM, BACKLOG_TASK_PRIORITY.HIGH], {
    message: 'Priority must be selected',
  }),
  groupId: z.string().min(1, { message: 'Group must be selected' }),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Date must be a valid date',
    })
    .nullable(),
});

export type CreateBacklogTask = z.infer<typeof createBacklogTaskSchema>;

export const updateBacklogTaskSchema = createBacklogTaskSchema;
export type UpdateBacklogTask = CreateBacklogTask;

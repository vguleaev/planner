import type { ValueOf } from 'ts-essentials';
import type { UserType } from '@kinde-oss/kinde-typescript-sdk';
import { type BacklogTask, type BacklogTaskGroup } from '../db/schema';
import { BACKLOG_TASK_PRIORITY } from '../constants/backlog-task-priority.const';
import { BACKLOG_TASK_CREATED_FILTER } from '../constants/backlog-task-created-filter';
import { getGroups } from '../repos/group.repo';
import { getTasksByCreatedDate } from '../repos/tasks.repo';

export type BacklogTaskGroupWithTasks = BacklogTaskGroup & {
  tasks: BacklogTask[];
};

const priorityMap = {
  [BACKLOG_TASK_PRIORITY.HIGH]: 1,
  [BACKLOG_TASK_PRIORITY.MEDIUM]: 2,
  [BACKLOG_TASK_PRIORITY.LOW]: 3,
};

export async function getBacklogTasks(user: UserType, createdFilter: ValueOf<typeof BACKLOG_TASK_CREATED_FILTER>) {
  const groups = await getGroups(user);
  const tasks = await getTasksByCreatedDate(user, createdFilter);

  const groupsWithTasks = groups.map((group) => {
    return {
      ...group,
      tasks: tasks
        .filter((task) => task.groupId === group.id)
        .sort((a, b) => {
          return priorityMap[a.priority] - priorityMap[b.priority];
        }),
    };
  });

  return groupsWithTasks;
}

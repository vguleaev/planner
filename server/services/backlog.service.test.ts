import { describe, it, expect, mock } from 'bun:test';
import { getBacklogTasks } from './backlog.service';
import { BACKLOG_TASK_CREATED_FILTER } from '../constants/backlog-task-created-filter';
import type { UserType } from '@kinde-oss/kinde-typescript-sdk';
import type { BacklogTask, BacklogTaskGroup } from '../db/schema';
import { BACKLOG_TASK_PRIORITY } from '../constants/backlog-task-priority.const';

describe('getBacklogTasks', () => {
  const user = { id: 'user1' } as UserType;
  const createdFilter = BACKLOG_TASK_CREATED_FILTER.TODAY;

  it('should fetch backlog task groups and tasks', async () => {
    const mockGroups = [
      { id: 'group1', name: 'test', userId: 'user1', createdAt: '2023-01-01T00:00:00Z' },
    ] as BacklogTaskGroup[];

    const mockTasks = [
      {
        id: 'task1',
        userId: 'user1',
        groupId: 'group1',
        priority: BACKLOG_TASK_PRIORITY.HIGH,
        createdAt: '2023-01-01T00:00:00Z',
      },
    ] as BacklogTask[];

    mock.module('../repos/group.repo', () => ({
      getGroups: () => Promise.resolve(mockGroups),
    }));

    mock.module('../repos/tasks.repo', () => ({
      getTasksByCreatedDate: () => Promise.resolve(mockTasks),
    }));

    const result = await getBacklogTasks(user, createdFilter);

    expect(result).toEqual([
      {
        ...mockGroups[0],
        tasks: mockTasks,
      },
    ]);
  });

  it('should sort tasks by priority', async () => {
    const mockGroups = [{ id: 'group1', userId: 'user1', createdAt: '2023-01-01T00:00:00Z' }] as BacklogTaskGroup[];
    const mockTasks = [
      {
        id: 'task1',
        userId: 'user1',
        groupId: 'group1',
        priority: BACKLOG_TASK_PRIORITY.LOW,
        createdAt: '2023-01-01T00:00:00Z',
      },
      {
        id: 'task2',
        userId: 'user1',
        groupId: 'group1',
        priority: BACKLOG_TASK_PRIORITY.HIGH,
        createdAt: '2023-01-01T00:00:00Z',
      },
    ] as BacklogTask[];

    mock.module('../repos/group.repo', () => ({
      getGroups: () => Promise.resolve(mockGroups),
    }));

    mock.module('../repos/tasks.repo', () => ({
      getTasksByCreatedDate: () => Promise.resolve(mockTasks),
    }));

    const result = await getBacklogTasks(user, createdFilter);
    expect(result[0].tasks).toEqual([mockTasks[1], mockTasks[0]]);
  });
});

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useBacklog, useDeleteGroup } from '@/hooks/backlog-tasks.hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CalendarIcon,
  CheckCircle2Icon,
  CircleIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  MoreVertical,
  XCircleIcon,
  CalendarClockIcon,
} from 'lucide-react';
import { BACKLOG_TASK_PRIORITY } from '@server/constants/backlog-task-priority.const';
import { ValueOf } from 'ts-essentials';
import { BACKLOG_TASK_STATUS } from '@server/constants/backlog-task-status.const';
import { startCase, toLower } from 'lodash';
import dayjs from 'dayjs';
import { GroupModal } from '@/components/group-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from './confirm-dialog';
import { BacklogTaskGroupWithTasks } from '@server/routes/backlog.route';
import { useState } from 'react';
import { useGroupModalStore } from '@/stores/group-modal.store';
import { useTaskModalStore } from '@/stores/task-modal.store';
import { BacklogTask } from '@server/db/schema';
import { useFiltersStore } from '@/stores/filters.store';
import { BACKLOG_TASK_FILTER } from '@server/constants/backlog-task-filter.const';
import { cn } from '@/lib/utils';

export function Backlog() {
  const { isPending, data: backlog } = useBacklog();
  const { mutateAsync: deleteGroup } = useDeleteGroup();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { selectedStatusFilter } = useFiltersStore((state) => ({
    selectedStatusFilter: state.selectedStatusFilter,
  }));

  const { setIsGroupModalOpen, setSelectedGroup } = useGroupModalStore((state) => ({
    setIsGroupModalOpen: state.setIsOpen,
    setSelectedGroup: state.setSelectedGroup,
  }));

  const { setIsTaskModalOpen, setSelectedTask } = useTaskModalStore((state) => ({
    setIsTaskModalOpen: state.setIsOpen,
    setSelectedTask: state.setSelectedTask,
  }));

  const onDelete = async (id: string) => {
    await deleteGroup({ id });
  };

  const onEditGroupClick = (group: BacklogTaskGroupWithTasks) => {
    setSelectedGroup(group);
    setIsGroupModalOpen(true);
  };

  const onTaskTitleClick = (task: BacklogTask) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const getFilteredTasks = (group: BacklogTaskGroupWithTasks) => {
    switch (selectedStatusFilter) {
      case BACKLOG_TASK_FILTER.NOT_COMPLETED:
        return group.tasks.filter((task) => task.status === BACKLOG_TASK_STATUS.NOT_COMPLETED);
      case BACKLOG_TASK_FILTER.COMPLETED:
        return group.tasks.filter((task) => task.status === BACKLOG_TASK_STATUS.COMPLETED);
      case BACKLOG_TASK_FILTER.ALL:
        return group.tasks;
    }
  };

  const renderSkeletons = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
        <Skeleton className="min-h-full" />
        <Skeleton className="min-h-full" />
        <Skeleton className="min-h-full" />
      </div>
    );
  };

  const PriorityIcon = ({ priority }: { priority: ValueOf<typeof BACKLOG_TASK_PRIORITY> }) => {
    switch (priority) {
      case BACKLOG_TASK_PRIORITY.LOW:
        return <AlertCircleIcon className="w-4 h-4 text-blue-500" />;
      case BACKLOG_TASK_PRIORITY.MEDIUM:
        return <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case BACKLOG_TASK_PRIORITY.HIGH:
        return <AlertCircleIcon className="w-4 h-4 text-red-500" />;
    }
  };

  const StatusIcon = ({ status }: { status: ValueOf<typeof BACKLOG_TASK_STATUS> }) => {
    switch (status) {
      case BACKLOG_TASK_STATUS.NOT_COMPLETED:
        return <CircleIcon className="w-5 h-5 text-gray-300" />;
      case BACKLOG_TASK_STATUS.COMPLETED:
        return <CheckCircle2Icon className="w-5 h-5 text-green-500" />;
      case BACKLOG_TASK_STATUS.WONT_DO:
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
  };

  const DeadlineDateIcon = ({
    deadline,
    status,
  }: {
    deadline: string | null;
    status: ValueOf<typeof BACKLOG_TASK_STATUS>;
  }) => {
    if (!deadline) {
      return null;
    }
    const isPastDeadline = dayjs(deadline).isBefore(dayjs()) && status !== BACKLOG_TASK_STATUS.COMPLETED;
    const isDeadlineSoon = dayjs(deadline).isBefore(dayjs().add(3, 'days')) && status !== BACKLOG_TASK_STATUS.COMPLETED;
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
        <CalendarClockIcon className="w-4 h-4" />
        <span className="font-bold mr-2">Deadline:</span>
        <span
          className={cn('font-bold', {
            'text-red-500': isPastDeadline,
            'text-orange-500': isDeadlineSoon && !isPastDeadline,
          })}>
          {dayjs(deadline).format('MMMM D, YYYY')}
        </span>
      </div>
    );
  };

  const renderSingleNewGroupPlaceholder = (key: number) => {
    return (
      <Card key={key} className="min-h-full bg-muted/40 dark:bg-muted/20">
        <CardContent className="p-4">
          <div>
            <Button variant={'outline'} onClick={() => setIsGroupModalOpen(true)}>
              Create group...
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderNewGroupsPlaceholders = () => {
    if (!backlog) {
      return null;
    }
    return Array.from({ length: 3 - backlog.groups.length }).map((_, i) => renderSingleNewGroupPlaceholder(i));
  };

  const renderGroupOptionsDropdown = (group: BacklogTaskGroupWithTasks) => {
    return (
      <div className="mr-[-12px] !mt-[-8px]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <div className="w-full cursor-pointer" onClick={() => onEditGroupClick(group)}>
                Edit
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="w-full cursor-pointer" onClick={() => setIsDeleteModalOpen(true)}>
                Delete
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
          <ConfirmDialog
            open={isDeleteModalOpen}
            onOpenChange={(value) => setIsDeleteModalOpen(value)}
            onConfirm={() => onDelete(group.id)}
          />
        </DropdownMenu>
      </div>
    );
  };

  if (isPending) {
    return renderSkeletons();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
      {backlog &&
        backlog.groups.map((group) => (
          <Card key={group.name} className="min-h-full bg-muted/40 dark:bg-muted/20">
            <CardHeader className="flex flex-row justify-between items-start">
              <CardTitle>{group.name}</CardTitle>
              {renderGroupOptionsDropdown(group)}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredTasks(group).map((task) => (
                  <Card key={task.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-[1fr,auto] gap-2">
                        <div className="space-y-2">
                          <h3
                            className="font-semibold line-clamp-2 hover:underline cursor-pointer"
                            onClick={() => onTaskTitleClick(task)}>
                            {task.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <PriorityIcon priority={task.priority} />
                            <span>{startCase(toLower(task.priority))}</span>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <StatusIcon status={task.status} />
                        </div>
                      </div>
                      <div>
                        <DeadlineDateIcon deadline={task.dueDate} status={task.status} />
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{dayjs(task.createdAt).format('MMMM D, YYYY h:mm A')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {group.tasks.length === 0 && <p className="text-gray-500">No tasks in backlog</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      {renderNewGroupsPlaceholders()}
      <GroupModal />
    </div>
  );
}

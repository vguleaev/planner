import { Skeleton } from '@/components/ui/skeleton';
import { useToggleTask } from '@/hooks/backlog-tasks.hooks';
import { Card, CardContent } from '@/components/ui/card';
import {
  CalendarIcon,
  CheckCircle2Icon,
  CircleIcon,
  AlertCircleIcon,
  XCircleIcon,
  CalendarClockIcon,
} from 'lucide-react';
import { BACKLOG_TASK_PRIORITY } from '@server/constants/backlog-task-priority.const';
import { ValueOf } from 'ts-essentials';
import { BACKLOG_TASK_STATUS } from '@server/constants/backlog-task-status.const';
import { startCase, toLower } from 'lodash';
import dayjs from 'dayjs';
import { useTaskModalStore } from '@/stores/task-modal.store';
import { BacklogTask } from '@server/db/schema';
import { cn } from '@/lib/utils';

type BacklogTaskCardProps = {
  task: BacklogTask;
};

export function BacklogTaskCard({ task }: BacklogTaskCardProps) {
  const { isPending, mutateAsync: toggleTask } = useToggleTask();

  const { setIsTaskModalOpen, setSelectedTask } = useTaskModalStore((state) => ({
    setIsTaskModalOpen: state.setIsOpen,
    setSelectedTask: state.setSelectedTask,
  }));

  const onTaskTitleClick = (task: BacklogTask) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const onToggleTaskClick = async (task: BacklogTask) => {
    if (isPending || task.status === BACKLOG_TASK_STATUS.WONT_DO) {
      return;
    }
    await toggleTask({ id: task.id });
  };

  const PriorityIcon = ({ priority }: { priority: ValueOf<typeof BACKLOG_TASK_PRIORITY> }) => {
    switch (priority) {
      case BACKLOG_TASK_PRIORITY.LOW:
        return <AlertCircleIcon className="w-4 h-4 text-blue-500" />;
      case BACKLOG_TASK_PRIORITY.MEDIUM:
        return <AlertCircleIcon className="w-4 h-4 text-yellow-500" />;
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

  const renderStatusIcon = (task: BacklogTask) => {
    if (isPending) {
      return <Skeleton className="w-5 h-5 rounded-full" />;
    }
    return (
      <div className="cursor-pointer" onClick={() => onToggleTaskClick(task)}>
        <StatusIcon status={task.status} />
      </div>
    );
  };

  return (
    <div>
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
            <div className="flex justify-end">{renderStatusIcon(task)}</div>
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
    </div>
  );
}

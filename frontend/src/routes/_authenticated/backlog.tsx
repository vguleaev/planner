import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useBacklog } from '@/hooks/expenses.hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, CheckCircle2Icon, CircleIcon, AlertCircleIcon, AlertTriangleIcon } from 'lucide-react';
import { BACKLOG_TASK_PRIORITY } from '@server/constants/backlog-task-priority.const';
import { ValueOf } from 'ts-essentials';
import { BACKLOG_TASK_STATUS } from '@server/constants/backlog-task-status.const';
import { startCase, toLower } from 'lodash';
import dayjs from 'dayjs';
import { TaskCreationModal } from '@/components/task-creation-modal';
import { GroupCreationModal } from '@/components/group-creation-modal';

export const Route = createFileRoute('/_authenticated/backlog')({
  component: ExpensesPage,
});

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

function ExpensesPage() {
  const { isPending, data: backlog } = useBacklog();
  // const { isPending: isDeleting, mutate } = useDeleteExpense();

  // const onDelete = (id: string) => {
  //   mutate({ id });
  // };

  if (isPending) {
    return <div>Loading</div>;
  }

  const renderAddTaskButton = () => {
    if (backlog && backlog.groups.length === 0) {
      return null;
    }
    return (
      <TaskCreationModal>
        <Button>Create Task</Button>
      </TaskCreationModal>
    );
  };

  const renderSingleNewGroupPlaceholder = (key: number) => {
    return (
      <Card key={key} className="min-h-full bg-muted/20">
        <CardContent className="p-4">
          <div>
            <GroupCreationModal>
              <Button variant={'outline'}>Create group...</Button>
            </GroupCreationModal>
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

  return (
    <div className="p-2 m-auto">
      {isPending && <Skeleton />}
      <div className="container mx-auto p-4">
        <div className="flex flex-row justify-between pb-4">
          <h1 className="text-2xl font-bold mb-4">Backlog</h1>
          {renderAddTaskButton()}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
          {backlog &&
            backlog.groups.map((group) => (
              <Card key={group.name} className="min-h-full bg-muted/20">
                <CardHeader>
                  <CardTitle>{group.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {group.tasks.map((task) => (
                      <Card key={task.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-[1fr,auto] gap-2">
                            <div className="space-y-2">
                              <h3 className="font-semibold line-clamp-2">{task.title}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <PriorityIcon priority={task.priority} />
                                <span>{startCase(toLower(task.priority))}</span>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              {task.status === BACKLOG_TASK_STATUS.COMPLETED ? (
                                <CheckCircle2Icon className="w-5 h-5 text-green-500" />
                              ) : (
                                <CircleIcon className="w-5 h-5 text-gray-300" />
                              )}
                            </div>
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
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useBacklog, useDeleteGroup } from '@/hooks/backlog-tasks.hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreVertical } from 'lucide-react';
import { BACKLOG_TASK_STATUS } from '@server/constants/backlog-task-status.const';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from './confirm-dialog';
import { useState } from 'react';
import { useGroupModalStore } from '@/stores/group-modal.store';
import { useFiltersStore } from '@/stores/filters.store';
import { BACKLOG_TASK_STATUS_FILTER } from '@server/constants/backlog-task-status-filter.const';
import { BacklogTaskCard } from './backlog-task-card';
import { BacklogTaskGroupWithTasks } from '@server/services/backlog.service';

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

  const onDelete = async (id: string) => {
    await deleteGroup({ id });
  };

  const onEditGroupClick = (group: BacklogTaskGroupWithTasks) => {
    setSelectedGroup(group);
    setIsGroupModalOpen(true);
  };

  const getFilteredTasks = (group: BacklogTaskGroupWithTasks) => {
    switch (selectedStatusFilter) {
      case BACKLOG_TASK_STATUS_FILTER.NOT_COMPLETED:
        return group.tasks.filter((task) => task.status === BACKLOG_TASK_STATUS.NOT_COMPLETED);
      case BACKLOG_TASK_STATUS_FILTER.COMPLETED:
        return group.tasks.filter((task) => task.status === BACKLOG_TASK_STATUS.COMPLETED);
      case BACKLOG_TASK_STATUS_FILTER.ALL:
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
                  <BacklogTaskCard task={task} />
                ))}
                {getFilteredTasks(group).length === 0 && <p className="text-gray-500">No tasks in backlog</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      {renderNewGroupsPlaceholders()}
    </div>
  );
}

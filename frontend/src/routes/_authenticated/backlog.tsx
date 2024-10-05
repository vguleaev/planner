import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useBacklog } from '@/hooks/backlog-tasks.hooks';
import { TaskModal } from '@/components/task-modal';
import { Backlog } from '@/components/backlog';
import { useTaskModalStore } from '@/stores/task-modal.store';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BACKLOG_TASK_FILTER } from '@server/constants/backlog-task-filter.const';
import { ValueOf } from 'ts-essentials';
import { useFiltersStore } from '@/stores/filters.store';
import { GroupModal } from '@/components/group-modal';

export const Route = createFileRoute('/_authenticated/backlog')({
  component: BacklogPage,
});

function BacklogPage() {
  const { isPending, data: backlog } = useBacklog();

  const { setIsTaskModalOpen } = useTaskModalStore((state) => ({
    setIsTaskModalOpen: state.setIsOpen,
  }));

  const { selectedStatusFilter, setSelectedStatusFilter } = useFiltersStore((state) => ({
    selectedStatusFilter: state.selectedStatusFilter,
    setSelectedStatusFilter: state.setSelectedStatusFilter,
  }));

  const renderToolbar = () => {
    if (isPending || (backlog && backlog.groups.length === 0)) {
      return null;
    }
    return (
      <div className="flex flex-col md:flex-row gap-6">
        <Tabs
          value={selectedStatusFilter}
          onValueChange={(value) => setSelectedStatusFilter(value as ValueOf<typeof BACKLOG_TASK_FILTER>)}
          className="">
          <TabsList>
            <TabsTrigger value={BACKLOG_TASK_FILTER.NOT_COMPLETED}>Not completed</TabsTrigger>
            <TabsTrigger value={BACKLOG_TASK_FILTER.COMPLETED}>Completed</TabsTrigger>
            <TabsTrigger value={BACKLOG_TASK_FILTER.ALL}>All</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => setIsTaskModalOpen(true)}>Create Task</Button>
      </div>
    );
  };

  return (
    <div className="pt-6">
      <div className="flex flex-col md:flex-row justify-between pb-4">
        <h1 className="text-2xl font-bold mb-4">Backlog</h1>
        {renderToolbar()}
      </div>
      <Backlog />
      <GroupModal />
      <TaskModal />
    </div>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useBacklog } from '@/hooks/backlog-tasks.hooks';
import { TaskModal } from '@/components/task-modal';
import { Backlog } from '@/components/backlog';
import { useTaskModalStore } from '@/stores/task-modal.store';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BACKLOG_TASK_STATUS_FILTER } from '@server/constants/backlog-task-status-filter.const';
import { ValueOf } from 'ts-essentials';
import { useFiltersStore } from '@/stores/filters.store';
import { GroupModal } from '@/components/group-modal';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { BACKLOG_TASK_CREATED_FILTER } from '@server/constants/backlog-task-created-filter';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/backlog')({
  component: BacklogPage,
});

function BacklogPage() {
  const { setIsTaskModalOpen } = useTaskModalStore((state) => ({
    setIsTaskModalOpen: state.setIsOpen,
  }));

  const { selectedStatusFilter, setSelectedStatusFilter, selectedCreatedFilter, setSelectedCreatedFilter } =
    useFiltersStore((state) => ({
      selectedStatusFilter: state.selectedStatusFilter,
      selectedCreatedFilter: state.selectedCreatedFilter,
      setSelectedStatusFilter: state.setSelectedStatusFilter,
      setSelectedCreatedFilter: state.setSelectedCreatedFilter,
    }));

  const { isPending, data: backlog, refetch } = useBacklog();

  useEffect(() => {
    refetch();
  }, [selectedCreatedFilter]);

  const onCreatedFilterChange = (value: ValueOf<typeof BACKLOG_TASK_CREATED_FILTER>) => {
    setSelectedCreatedFilter(value);
  };

  const renderToolbar = () => {
    if (backlog && backlog.groups.length === 0) {
      return null;
    }
    return (
      <div className="flex flex-col md:flex-row gap-6">
        <Select onValueChange={onCreatedFilterChange} value={selectedCreatedFilter}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <SelectValue placeholder="Select created date filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={BACKLOG_TASK_CREATED_FILTER.TODAY}>Today</SelectItem>
              <SelectItem value={BACKLOG_TASK_CREATED_FILTER.LAST_7_DAYS}>Last 7 Days</SelectItem>
              <SelectItem value={BACKLOG_TASK_CREATED_FILTER.LAST_MONTH}>Last Month</SelectItem>
              <SelectItem value={BACKLOG_TASK_CREATED_FILTER.LAST_3_MONTHS}>Last 3 Months</SelectItem>
              <SelectItem value={BACKLOG_TASK_CREATED_FILTER.LAST_6_MONTHS}>Last 6 Months</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Tabs
          value={selectedStatusFilter}
          onValueChange={(value) => setSelectedStatusFilter(value as ValueOf<typeof BACKLOG_TASK_STATUS_FILTER>)}
          className="">
          <TabsList>
            <TabsTrigger value={BACKLOG_TASK_STATUS_FILTER.NOT_COMPLETED}>Not completed</TabsTrigger>
            <TabsTrigger value={BACKLOG_TASK_STATUS_FILTER.COMPLETED}>Completed</TabsTrigger>
            <TabsTrigger value={BACKLOG_TASK_STATUS_FILTER.ALL}>All</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button disabled={isPending} onClick={() => setIsTaskModalOpen(true)}>
          Create Task
        </Button>
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

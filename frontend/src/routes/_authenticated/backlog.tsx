import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useBacklog } from '@/hooks/backlog-tasks.hooks';
import { TaskModal } from '@/components/task-modal';
import { Backlog } from '@/components/backlog';
import { useTaskModalStore } from '@/stores/task-modal.store';

export const Route = createFileRoute('/_authenticated/backlog')({
  component: BacklogPage,
});

function BacklogPage() {
  const { isPending, data: backlog } = useBacklog();

  const { setIsTaskModalOpen } = useTaskModalStore((state) => ({
    setIsTaskModalOpen: state.setIsOpen,
  }));

  const renderAddTaskButton = () => {
    if (isPending || (backlog && backlog.groups.length === 0)) {
      return null;
    }
    return <Button onClick={() => setIsTaskModalOpen(true)}>Create Task</Button>;
  };

  return (
    <div className="p-2 m-auto">
      <div className="container mx-auto p-4">
        <div className="flex flex-row justify-between pb-4">
          <h1 className="text-2xl font-bold mb-4">Backlog</h1>
          {renderAddTaskButton()}
        </div>
        <Backlog />
        <TaskModal />
      </div>
    </div>
  );
}

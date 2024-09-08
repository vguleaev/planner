import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useBacklog } from '@/hooks/expenses.hooks';
import { TaskCreationModal } from '@/components/task-creation-modal';
import { Backlog } from '@/components/backlog';

export const Route = createFileRoute('/_authenticated/backlog')({
  component: ExpensesPage,
});

function ExpensesPage() {
  const { isPending, data: backlog } = useBacklog();

  const renderAddTaskButton = () => {
    if (isPending || (backlog && backlog.groups.length === 0)) {
      return null;
    }
    return (
      <TaskCreationModal>
        <Button>Create Task</Button>
      </TaskCreationModal>
    );
  };

  return (
    <div className="p-2 m-auto">
      <div className="container mx-auto p-4">
        <div className="flex flex-row justify-between pb-4">
          <h1 className="text-2xl font-bold mb-4">Backlog</h1>
          {renderAddTaskButton()}
        </div>
        <Backlog />
      </div>
    </div>
  );
}

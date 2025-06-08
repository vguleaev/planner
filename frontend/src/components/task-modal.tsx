import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, LoaderCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { useBacklog, useCreateTask, useDeleteTask, useUpdateTask } from '@/hooks/backlog-tasks.hooks';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useTaskModalStore } from '@/stores/task-modal.store';
import { createBacklogTaskSchema } from '@server/validation/backlog-tasks.schema';
import { BACKLOG_TASK_STATUS } from '@server/constants/backlog-task-status.const';
import { BACKLOG_TASK_PRIORITY } from '@server/constants/backlog-task-priority.const';
import { ValueOf } from 'ts-essentials';
import { FormFieldError } from './form-field-error';
import { SyntheticEvent, useState } from 'react';
import { ConfirmDialog } from './confirm-dialog';

export function TaskModal() {
  const { mutateAsync: createTask } = useCreateTask();
  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: onDeleteTask } = useDeleteTask();
  const { data: backlog } = useBacklog();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { isOpen, setIsOpen, selectedTask, setSelectedTask } = useTaskModalStore((state) => ({
    isOpen: state.isOpen,
    setIsOpen: state.setIsOpen,
    selectedTask: state.selectedTask,
    setSelectedTask: state.setSelectedTask,
  }));

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: selectedTask?.title || '',
      description: selectedTask?.description || '',
      status: (selectedTask?.status || BACKLOG_TASK_STATUS.NOT_COMPLETED) as ValueOf<typeof BACKLOG_TASK_STATUS>,
      priority: (selectedTask?.priority || BACKLOG_TASK_PRIORITY.MEDIUM) as ValueOf<typeof BACKLOG_TASK_PRIORITY>,
      dueDate: selectedTask?.dueDate || null,
      groupId: selectedTask?.groupId || '',
    },
    onSubmit: async ({ value }) => {
      if (!selectedTask) {
        await createTask({ newTask: value });
      } else {
        await updateTask({ id: selectedTask.id, updatedTask: value });
      }
      clear();
      setIsOpen(false);
    },
  });

  const clear = () => {
    setTimeout(() => {
      form.reset();
      setSelectedTask(null);
    }, 300);
  };

  const onOpenChange = (open: boolean) => {
    clear();
    setIsOpen(open);
  };

  const onDelete = async (id: string) => {
    await onDeleteTask({ id });
    setIsDeleteModalOpen(false);
    setIsOpen(false);
  };

  const getTitle = () => {
    return selectedTask ? 'Edit Task' : 'Create Task';
  };

  const getGroupsOptions = () => {
    return backlog?.groups.map((group) => ({ label: group.name, value: group.id })) || [];
  };

  const onDeleteTaskClick = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsDeleteModalOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}>
          <div className="grid gap-4 py-4">
            <form.Field
              name="title"
              validators={{
                onSubmit: createBacklogTaskSchema.shape.title,
              }}
              children={(field) => (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor={field.name} className="text-right">
                      Title
                    </label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <FormFieldError field={field} />
                </div>
              )}
            />
            <form.Field
              name="description"
              validators={{
                onSubmit: createBacklogTaskSchema.shape.description,
              }}
              children={(field) => (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-4 gap-4">
                    <label htmlFor={field.name} className="text-right">
                      Description
                    </label>
                    <Textarea
                      rows={6}
                      id={field.name}
                      value={field.state.value}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <FormFieldError field={field} />
                </div>
              )}
            />
            <form.Field
              name="status"
              validators={{
                onSubmit: createBacklogTaskSchema.shape.status,
              }}
              children={(field) => (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor={field.name} className="text-right">
                      Status
                    </label>
                    <Select
                      value={field.state.value}
                      name={field.name}
                      onValueChange={(value) => field.handleChange(value as ValueOf<typeof BACKLOG_TASK_STATUS>)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={BACKLOG_TASK_STATUS.NOT_COMPLETED}>Not completed</SelectItem>
                        <SelectItem value={BACKLOG_TASK_STATUS.COMPLETED}>Completed</SelectItem>
                        <SelectItem value={BACKLOG_TASK_STATUS.WONT_DO}>Wont do</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormFieldError field={field} />
                </div>
              )}
            />
            <form.Field
              name="priority"
              validators={{
                onSubmit: createBacklogTaskSchema.shape.priority,
              }}
              children={(field) => (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor={field.name} className="text-right">
                      Priority
                    </label>
                    <Select
                      value={field.state.value}
                      name={field.name}
                      onValueChange={(value) => field.handleChange(value as ValueOf<typeof BACKLOG_TASK_PRIORITY>)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={BACKLOG_TASK_PRIORITY.LOW}>Low</SelectItem>
                        <SelectItem value={BACKLOG_TASK_PRIORITY.MEDIUM}>Medium</SelectItem>
                        <SelectItem value={BACKLOG_TASK_PRIORITY.HIGH}>High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormFieldError field={field} />
                </div>
              )}
            />
            <form.Field
              name="groupId"
              validators={{
                onSubmit: createBacklogTaskSchema.shape.groupId,
              }}
              children={(field) => (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor={field.name} className="text-right">
                      Group
                    </label>
                    <Select
                      value={field.state.value}
                      name={field.name}
                      onValueChange={(value) => field.handleChange(value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                      <SelectContent>
                        {getGroupsOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormFieldError field={field} />
                </div>
              )}
            />
            <form.Field
              name="dueDate"
              validators={{
                onSubmit: createBacklogTaskSchema.shape.dueDate,
              }}
              children={(field) => (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor={field.name} className="text-right">
                      Deadline Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={`col-span-3 justify-start text-left font-normal ${!field.state.value && 'text-muted-foreground'}`}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.state.value ? (
                            <div className="relative w-full">
                              <span>{format(field.state.value, 'PPP')}</span>
                              <div className="absolute p-4 right-0 -mt-8 -mr-5">
                                {field.state.value && (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      field.handleChange(null);
                                    }}>
                                    <X className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          id={field.name}
                          mode="single"
                          selected={field.state.value ? new Date(field.state.value) : new Date()}
                          onDayBlur={field.handleBlur}
                          onSelect={(date) => field.handleChange((date ?? new Date()).toISOString())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormFieldError field={field} />
                </div>
              )}
            />
          </div>
          <div className="flex flex-row w-full justify-between">
            <div>
              {selectedTask && (
                <Button variant="destructive" onClick={onDeleteTaskClick}>
                  Delete
                </Button>
              )}
            </div>
            <div className="flex flex-row gap-4">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                  </Button>
                )}
              />
            </div>
          </div>
          <ConfirmDialog
            open={isDeleteModalOpen}
            onOpenChange={(value) => setIsDeleteModalOpen(value)}
            onConfirm={() => onDelete(selectedTask!.id)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

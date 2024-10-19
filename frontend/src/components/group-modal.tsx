import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useForm } from '@tanstack/react-form';
import { createBacklogTaskGroupSchema } from '@server/validation/backlog-task-groups.schema';
import { useCreateGroup, useUpdateGroup } from '@/hooks/backlog-tasks.hooks';
import { useGroupModalStore } from '@/stores/group-modal.store';
import { FormFieldError } from './form-field-error';

export function GroupModal() {
  const { mutateAsync: createGroup } = useCreateGroup();
  const { mutateAsync: updateGroup } = useUpdateGroup();

  const { isOpen, setIsOpen, selectedGroup, setSelectedGroup } = useGroupModalStore((state) => ({
    isOpen: state.isOpen,
    setIsOpen: state.setIsOpen,
    selectedGroup: state.selectedGroup,
    setSelectedGroup: state.setSelectedGroup,
  }));

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: selectedGroup?.name || '',
    },
    onSubmit: async ({ value }) => {
      if (!selectedGroup) {
        await createGroup({ newGroup: value });
      } else {
        await updateGroup({ id: selectedGroup.id, updatedGroup: value });
      }
      clear();
      setIsOpen(false);
    },
  });

  const clear = () => {
    setTimeout(() => {
      form.reset();
      setSelectedGroup(null);
    }, 300);
  };

  const onOpenChange = (open: boolean) => {
    clear();
    setIsOpen(open);
  };

  const getTitle = () => {
    return selectedGroup ? 'Edit Group' : 'Create Group';
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
          <form.Field
            name="name"
            validators={{
              onSubmit: createBacklogTaskGroupSchema.shape.name,
            }}
            children={(field) => (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor={field.name} className="text-right">
                    Name
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
          <div className="flex flex-row w-full justify-end gap-4">
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
        </form>
      </DialogContent>
    </Dialog>
  );
}

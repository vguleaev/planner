import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useForm } from '@tanstack/react-form';
import { createBacklogTaskGroupSchema } from '@server/validation/backlog-task-groups.schema';
import { useCreateGroup } from '@/hooks/expenses.hooks';

export function GroupCreationModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = useCreateGroup();

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({ newGroup: value });
      setOpen(false);
    },
  });

  const onOpenChange = (isOpen: boolean) => {
    form.reset();
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
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
            )}
          />
          <div className="flex flex-row w-full justify-end gap-4">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@radix-ui/react-label';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import type { FieldApi } from '@tanstack/react-form';
import { LoaderCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { zodValidator } from '@tanstack/zod-form-adapter';

import { createExpenseSchema } from '@server/validation/expenses.schema';
import { useToast } from '@/hooks/use-toast';

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpensePage,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  );
}

function CreateExpensePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: '',
      amount: 0,
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const res = await api.expenses.$post({ json: value });
      if (!res.ok) {
        console.error('Error creating expense:', res.statusText);
        return;
      }
      toast({
        title: 'Success!',
        description: 'You have successfully created a new expense.',
      });
      navigate({ to: '/expenses' });
    },
  });

  return (
    <div className="p-2 max-w-xl m-auto">
      <h2>Create Expense</h2>
      <form
        className="flex flex-col pt-2 gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
        <form.Field
          name="title"
          validators={{
            onSubmit: createExpenseSchema.shape.title,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Title</Label>
              <Input
                className="my-2"
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </div>
          )}
        />
        <form.Field
          name="amount"
          validators={{
            onSubmit: createExpenseSchema.shape.amount,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                className="my-2"
                type="number"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              <FieldInfo field={field} />
            </div>
          )}
        />
        <div className="w-full flex flex-row justify-center items-center">
          <form.Field
            name="date"
            validators={{
              onSubmit: createExpenseSchema.shape.date,
            }}
            children={(field) => (
              <div>
                <Calendar
                  mode="single"
                  id={field.name}
                  selected={new Date(field.state.value)}
                  onDayBlur={field.handleBlur}
                  onSelect={(date) => field.handleChange((date ?? new Date()).toISOString())}
                  className="rounded-md border"
                />
                <FieldInfo field={field} />
              </div>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button className="mt-4 w-fit" type="submit" disabled={!canSubmit}>
              {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Create Expense
            </Button>
          )}
        />
      </form>
    </div>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useDeleteExpense, useExpenses } from '@/hooks/expenses.hooks';
import { Trash, LoaderCircle } from 'lucide-react';
import { ConfirmDialog } from '@/components/confirm-dialog';

export const Route = createFileRoute('/_authenticated/expenses')({
  component: ExpensesPage,
});

function ExpensesPage() {
  const { isPending, error, data } = useExpenses();
  const { isPending: isDeleting, mutate } = useDeleteExpense();

  const onDelete = (id: number) => {
    mutate({ id });
  };

  return (
    <div className="p-2 max-w-3xl m-auto">
      {error && <div>Error: {error.message}</div>}
      <Table>
        <TableCaption>A list of your recent expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6" />
                  </TableCell>
                </TableRow>
              ))
            : data &&
              data.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.id}</TableCell>
                  <TableCell className="font-medium">{expense.title}</TableCell>
                  <TableCell>{expense.amount} $</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    <ConfirmDialog onConfirm={() => onDelete(expense.id)}>
                      <Button disabled={isDeleting} variant="outline" size="icon">
                        {isDeleting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                      </Button>
                    </ConfirmDialog>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

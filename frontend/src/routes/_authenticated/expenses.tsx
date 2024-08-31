import { createFileRoute } from '@tanstack/react-router';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useExpenses } from '@/hooks/expenses.hooks';

export const Route = createFileRoute('/_authenticated/expenses')({
  component: ExpensesPage,
});

function ExpensesPage() {
  const { isPending, error, data } = useExpenses();

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
                </TableRow>
              ))
            : data &&
              data.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.id}</TableCell>
                  <TableCell className="font-medium">{expense.title}</TableCell>
                  <TableCell>{expense.amount} $</TableCell>
                  <TableCell>{expense.date}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

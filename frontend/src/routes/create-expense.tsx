import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/create-expense')({
  component: CreateExpensePage,
});

function CreateExpensePage() {
  return (
    <div className="p-2 max-w-xl m-auto">
      <h2>Create Expense</h2>
      <form className="pt-2">
        <Label htmlFor="name">Name</Label>
        <Input className="my-2" type="text" id="name" placeholder="Name" />
        <Label htmlFor="amount">Amount</Label>
        <Input className="my-2" type="number" id="amount" placeholder="Amount" />
        <Button className="mt-4" type="submit">
          Create Expense
        </Button>
      </form>
    </div>
  );
}

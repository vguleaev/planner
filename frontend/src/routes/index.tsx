import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Logo from '@/assets/app-logo.svg?react';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const [count, setCount] = useState(0);

  const fetchExpenses = async () => {
    const response = await api.expenses.$get();
    const data = await response.json();
    return data;
  };

  const { isPending, error, data } = useQuery({ queryKey: ['expenses'], queryFn: fetchExpenses });

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Logo className="w-20 h-20 mb-10"></Logo>
      <div className="flex flex-col bg-background gap-5">
        <Button className="w-[100px] mr-5" onClick={() => setCount((count) => count + 1)}>
          Up
        </Button>
        <Button className="w-[100px]" onClick={() => setCount((count) => count - 1)}>
          Down
        </Button>
        <div className="text-muted-foreground">{count}</div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  );
}

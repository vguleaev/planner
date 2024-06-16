import { useEffect, useState } from 'react';
import './App.css';
import { Button } from '@/components/ui/button';
import Logo from './assets/planner-logo.svg?react';
import { api } from './lib/api';

function App() {
  const [count, setCount] = useState(0);

  const fetchExpenses = async () => {
    const response = await api.expenses.$get();
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

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
      </div>
    </>
  );
}

export default App;

import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const fetchExpenses = async () => {
    const response = await fetch('/api/expenses');
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    fetchExpenses();
  });

  return (
    <>
      <div className="flex flex-col">
        <button className="bg-green-100 mr-5" onClick={() => setCount((count) => count + 1)}>
          count is {count} UP
        </button>
        <button className="bg-red-100" onClick={() => setCount((count) => count - 1)}>
          count is {count} DOWN
        </button>
      </div>
    </>
  );
}

export default App;

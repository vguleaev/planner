import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/create-expense')({
  component: () => <div>Hello /create-expense!</div>,
});

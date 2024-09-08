import Logo from '@/assets/app-logo.svg?react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <>
      <Logo className="w-20 h-20 mb-10"></Logo>
    </>
  );
}

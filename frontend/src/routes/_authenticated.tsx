import { api } from '@/lib/api';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

const Component = () => {
  return <Outlet />;
};

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const response = await api.me.$get();
    if (response.status === 401) {
      const user = await response.json();
      if (user) {
        throw redirect({ to: '/' });
      }
    }

    const user = await response.json();
    return { user };
  },
  component: Component,
});

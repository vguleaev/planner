import { api } from '@/lib/api';
import { createFileRoute, Outlet } from '@tanstack/react-router';

const Login = () => {
  return (
    <div>
      <h1>You have to login</h1>
      <a href="/api/login">Login</a>
    </div>
  );
};

const Component = () => {
  const { user } = Route.useRouteContext();
  if (!user) {
    return <Login />;
  }
  return <Outlet />;
};

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const response = await api.me.$get();
    const user = await response.json();
    if (user) {
      return { user };
    }
    return { user: null };
  },
  component: Component,
});

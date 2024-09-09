import { Layout } from '@/components/layout';
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import IndexPage from '.';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const location = useLocation();
  if (location.pathname === '/') {
    return <IndexPage />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

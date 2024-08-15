import { useCurrentUser } from '@/hooks/user.hooks';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { isPending, error, data } = useCurrentUser();

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div>Profile: {data.given_name}</div>
      <div>Email: {data.email}</div>

      <a href="/api/logout">Logout</a>
    </div>
  );
}

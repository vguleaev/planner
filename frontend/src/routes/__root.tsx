import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: Root,
});

function NavBar() {
  return (
    <nav className="flex gap-3">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/expenses">Expenses</Link>
      <Link to="/create-expense">Create Expense</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  );
}

function Root() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

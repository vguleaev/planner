import { CircleUser, Menu } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/assets/app-logo.svg?react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCurrentUser } from '@/hooks/user.hooks';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  const { data } = useCurrentUser();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link to="/backlog" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Logo className="h-7 w-7 mr-2"></Logo>
          Planner
        </Link>
        <Link to="/backlog" className="text-muted-foreground transition-colors hover:text-foreground">
          Backlog
        </Link>
        <Link to="/profile" className="text-muted-foreground transition-colors hover:text-foreground">
          Profile
        </Link>
        <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">
          About
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
              <Logo className="h-7 w-7 mr-2"></Logo>
              Planner
            </Link>
            <Link to="/backlog" className="text-muted-foreground hover:text-foreground">
              Backlog
            </Link>
            <Link to="/profile" className="text-muted-foreground hover:text-foreground">
              Profile
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          <ThemeToggle />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div>{data?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <Link to="/profile" className="text-foreground transition-colors hover:text-foreground">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {' '}
              <a href="/api/logout">Logout</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

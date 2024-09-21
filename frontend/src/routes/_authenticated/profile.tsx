import { useCurrentUser } from '@/hooks/user.hooks';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut, Mail, User, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { isPending, error, data: user } = useCurrentUser();

  if (isPending)
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <Loader2 className="animate-spin h-16 w-16"></Loader2>
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <User className="text-muted-foreground w-6 h-6" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium text-xl">
                  {user.given_name} {user.family_name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="text-muted-foreground w-6 h-6" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-xl">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-start mt-8">
            <a href="/api/logout">
              <Button variant="outline" size="default">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

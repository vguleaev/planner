import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ListTodo, Calendar, Bell, LucideIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: () => <AboutPage />,
});

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center md:p-4">
      <Card className="w-full max-w-2xl border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">About Planner</CardTitle>
          <CardDescription className="text-center text-lg">Your Ultimate Task Management Solution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Planner is a powerful and intuitive task management tool designed to help you organize your life, boost
            productivity, and achieve your goals with ease.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureItem icon={ListTodo} title="Create Tasks">
              Easily add and organize your to-dos
            </FeatureItem>
            <FeatureItem icon={CheckCircle} title="Track Progress">
              Mark tasks as complete and visualize your achievements
            </FeatureItem>
            <FeatureItem icon={Calendar} title="Set Deadlines">
              Assign due dates to stay on top of your schedule
            </FeatureItem>
            <FeatureItem icon={Bell} title="Reminders">
              Get notified about upcoming and overdue tasks
            </FeatureItem>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/backlog">
            <Button size="lg">Start planning</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start space-x-3">
      <Icon className="w-6 h-6 text-primary mt-1" />
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}

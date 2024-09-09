import Logo from '@/assets/app-logo.svg?react';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDays, CheckCircle, ListTodo, Star } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { api } from '@/lib/api';

export const Route = createFileRoute('/')({
  component: IndexPage,
  beforeLoad: async () => {
    const response = await api.me.$get();
    if (response.status === 200) {
      const user = await response.json();
      if (user) {
        throw redirect({ to: '/backlog' });
      }
    }
  },
});

export default function IndexPage() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Logo className="h-7 w-7 mr-4" />
          Planner
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a href="/api/login">
            <Button variant="default" className="dark:text-white">
              Sign In
            </Button>
          </a>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-500 to-indigo-600">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_800px]">
              <div className="flex flex-col justify-center space-y-4 text-white">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Planner - Plan your daily, weekly and monthly tasks with ease
                  </h1>
                  <p className="max-w-[600px] text-gray-200 md:text-xl">
                    Planner helps you organize your tasks and boost productivity. Build your backlog and conquer your
                    goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <a href="/api/login">
                    <Button className="bg-white text-purple-600 hover:bg-gray-100">Get Started</Button>
                  </a>
                  <a href="#features">
                    <Button variant="ghost" className="border-white text-white hover:bg-white hover:text-purple-600">
                      Learn More
                    </Button>
                  </a>
                </div>
              </div>
              <img
                alt="Planner App"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-center sm:w-full lg:order-last"
                height="650"
                src="/app-screenshot.png"
                width="650"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Features</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <ListTodo className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Task Backlog</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Organize and prioritize your tasks for today, this week, or the entire month.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Easy Task Completion</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Mark tasks as complete with a simple click and track your progress.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <CalendarDays className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Overview</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get an overview about your future and past goals. You can look back and see what you have achieved.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              What Our Customers Say
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
                <Star className="h-8 w-8 text-yellow-400 mb-4" />
                <p className="mb-4">
                  "Planner has revolutionized how I manage my tasks. It's intuitive, flexible, and keeps me on track."
                </p>
                <p className="font-bold">- John Doe</p>
              </div>
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
                <Star className="h-8 w-8 text-yellow-400 mb-4" />
                <p className="mb-4">
                  "Planner was a discovery for me. I can't imagine my life without it anymore. It's a must-have tool!
                </p>
                <p className="font-bold">- Jane Doe</p>
              </div>
              <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
                <Star className="h-8 w-8 text-yellow-400 mb-4" />
                <p className="mb-4">
                  "How many fake testimonials can I write? I love Planner! It's the best thing since sliced bread."
                </p>
                <p className="font-bold">- Max Pecu</p>
              </div>
            </div>
          </div>
        </section>
        <section id="signup" className="w-full py-12 md:py-24 lg:py-32 bg-purple-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Boost Your Productivity?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Sign up now and start organizing your tasks with Planner. It is completely free forever!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Input
                    className="bg-white text-gray-900 placeholder:text-gray-500"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <a href="/api/login">
                    <Button className="bg-white text-purple-600 hover:bg-gray-100" type="submit">
                      Sign Up
                    </Button>
                  </a>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}

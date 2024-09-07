import { Footer } from './footer';
import { Navbar } from './navbar';
import { Toaster } from './ui/toaster';

export function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-68px)] w-full">
      <Navbar />
      <main className="container mx-auto py-10 flex-grow">{props.children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}

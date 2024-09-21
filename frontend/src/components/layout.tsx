import { Footer } from './footer';
import { Navbar } from './navbar';
import { Toaster } from './ui/toaster';

export function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="md:container mx-4 md:mx-auto flex-grow">{props.children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}

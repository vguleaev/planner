export function Footer() {
  return (
    <footer className="absolute w-full bottom-0 bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Planner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
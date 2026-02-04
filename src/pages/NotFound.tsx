import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-6">
        <div className="mb-6 flex justify-center">
          <Terminal className="h-16 w-16 text-primary animate-pulse" />
        </div>
        <h1 className="mb-2 text-6xl font-bold font-mono text-primary">404</h1>
        <p className="mb-2 text-xl text-foreground font-mono">
          <span className="text-muted-foreground">$</span> Page not found
        </p>
        <p className="mb-8 text-muted-foreground font-mono text-sm">
          The requested path <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code> does not exist.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

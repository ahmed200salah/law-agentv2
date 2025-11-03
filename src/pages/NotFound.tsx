import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-primary mb-4 animate-pulse-glow">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="px-8 py-2 text-lg glow-primary"
          >
            Go Home
          </Button>
          <p className="text-sm text-muted-foreground">
            Or try navigating back to a valid page
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroPattern from "@/assets/hero-pattern.jpg";
import { Seo } from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Seo
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
        ogTitle="404 - Page Not Found"
        ogDescription="The page you are looking for does not exist."
      />
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroPattern} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-emerald-deep/95" />
      </div>

      <div className="relative z-10 text-center text-primary-foreground px-4">
        <Moon className="w-16 h-16 mx-auto mb-6 text-gold opacity-50" />
        <h1 className="text-6xl md:text-8xl font-serif font-bold mb-2">404</h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-md mx-auto">
          The page you seek is beyond our current path.
        </p>
        <Button asChild variant="outline" className="bg-transparent border-gold text-gold hover:bg-gold hover:text-primary">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </section>
  );
};

export default NotFound;

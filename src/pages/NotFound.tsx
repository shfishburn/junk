import { useLocation, Link } from "react-router-dom";
import { Home, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/shared";

const NotFound = () => {
  const location = useLocation();

  return (
    <Layout>
      <SEO
        title="Page Not Found - Junky Gurus"
        description="The page you're looking for doesn't exist. Return to Junky Gurus homepage for junk removal services in Washington State."
        noIndex={true}
      />
      <div className="flex min-h-[60vh] items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <span className="text-8xl font-bold text-primary">404</span>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            Oops! This page got hauled away
          </h1>
          <p className="mb-8 text-muted-foreground">
            Looks like the page you're looking for doesn't exist or has been moved. 
            Don't worry, we're experts at removing unwanted things!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" size="lg">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                <Phone className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Need junk removal? Call us at{" "}
            <a href="tel:+13606109233" className="text-primary hover:underline font-medium">
              (360) 610-9233
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

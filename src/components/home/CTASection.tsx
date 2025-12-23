import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Clear the Clutter?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Get a free, no-obligation quote today. We'll give you an honest price and can often haul the same day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link to="/contact">Get a Free Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <a href="tel:+13605551234">
                <Phone className="mr-2 h-4 w-4" />
                Call (360) 555-1234
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

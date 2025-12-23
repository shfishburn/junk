import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero-gradient py-16 md:py-24 lg:py-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal mb-6 animate-fade-in">
            Fast, Local Junk Removal Serving Mount Vernon and the North Sound
          </h1>
          <p className="text-lg md:text-xl text-charcoal-light mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Simple junk removal. Honest pricing. Responsible disposal. From single items to full cleanouts — we handle it all.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="lg" className="text-base">
              <Link to="/contact">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <a href="tel:+13605551234">
                <Phone className="mr-2 h-4 w-4" />
                (360) 555-1234
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

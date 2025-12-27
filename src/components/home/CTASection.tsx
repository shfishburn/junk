import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 md:py-24 bg-primary">
      <div className="container">
        <div 
          className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Your Junk Won't Remove Itself (Trust Us, We've Asked)
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Get a free quote and experience the sweet, sweet freedom of a clutter-free life. We're weirdly excited to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl">
              <Link to="/contact">Get a Free Quote</Link>
            </Button>
            <Button asChild size="lg" variant="hero" className="text-base">
              <a href="tel:+13606109233">
                <Phone className="mr-2 h-4 w-4" />
                Call (360) 610-9233
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

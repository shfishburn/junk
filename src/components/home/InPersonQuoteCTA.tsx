import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Handshake, DollarSign, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks";

export function InPersonQuoteCTA() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 md:py-24">
      <div className="container">
        <div
          className={`max-w-4xl mx-auto p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                <Handshake className="h-4 w-4" />
                Free On-Site Estimates
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                We'll Come Look at It — Free
              </h2>
              <p className="text-muted-foreground mb-6">
                Pick a time, we show up, size up the job, and hand you a firm price. No hidden fees, no obligation.
              </p>

              <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Free, no obligation
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  Usually 15 minutes
                </div>
              </div>

              <Button asChild size="lg">
                <Link to="/free-estimate">
                  <Handshake className="mr-2 h-4 w-4" />
                  Schedule a Free Estimate
                </Link>
              </Button>
            </div>

            <div className="hidden md:flex items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
              <Handshake className="h-20 w-20 text-primary/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
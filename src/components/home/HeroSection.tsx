import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-junk.jpg";
import { JunkAnalyzerModal } from "@/components/JunkAnalyzerModal";

export function HeroSection() {
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);

  return (
    <>
      <section 
        className="relative py-16 md:py-24 lg:py-32 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 animate-fade-in">
              We Love Your Junk (So You Don't Have To)
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              That old couch mocking you from the garage? That exercise bike turned clothes hanger? We'll make it disappear faster than your motivation to use it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="text-base">
                <Link to="/contact">
                  Let's Ditch This Stuff
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="text-base"
                onClick={() => setIsAnalyzerOpen(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Get AI Quote
              </Button>
              <Button asChild variant="hero" size="lg" className="text-base">
                <a href="tel:+13606109233">
                  <Phone className="mr-2 h-4 w-4" />
                  (360) 610-9233
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <JunkAnalyzerModal open={isAnalyzerOpen} onOpenChange={setIsAnalyzerOpen} />
    </>
  );
}

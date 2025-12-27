import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dices, Gift, ArrowRight, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function GamificationCTA() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 md:py-24 bg-section-alt">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            More Fun, More Savings
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Why should junk removal be boring? Play games, share the love, and save money along the way.
          </p>
        </div>

        <div
          className={`grid md:grid-cols-2 gap-6 max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Junk Bingo */}
          <div className="group relative p-6 md:p-8 rounded-2xl bg-card border hover:border-primary/40 transition-all hover:shadow-lg">
            <div className="absolute top-4 right-4 text-4xl">🎲</div>
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                <Dices className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Junk Bingo</h3>
              <p className="text-muted-foreground text-sm">
                Check off items you have cluttering your space. Complete lines to unlock discounts up to 20% off!
              </p>
            </div>
            <div className="flex items-center gap-4 mb-4 text-sm">
              <span className="flex items-center gap-1 text-primary font-medium">
                <Gift className="w-4 h-4" />
                Up to 20% off
              </span>
            </div>
            <Button asChild variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Link to="/bingo">
                Play Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Junk Karma */}
          <div className="group relative p-6 md:p-8 rounded-2xl bg-card border hover:border-primary/40 transition-all hover:shadow-lg">
            <div className="absolute top-4 right-4 text-4xl">🎁</div>
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Junk Karma</h3>
              <p className="text-muted-foreground text-sm">
                Refer a friend and you both win. You get $25 off, they get 10% off. Good karma pays!
              </p>
            </div>
            <div className="flex items-center gap-4 mb-4 text-sm">
              <span className="flex items-center gap-1 text-primary font-medium">
                <Gift className="w-4 h-4" />
                $25 + 10% off
              </span>
            </div>
            <Button asChild variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Link to="/referrals">
                Share & Save <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

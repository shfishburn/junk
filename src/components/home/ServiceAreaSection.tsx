import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SERVICE_AREA_DATA } from "@/components/ServiceAreaInfo";

const counties = SERVICE_AREA_DATA.counties.map(c => ({
  name: c.name,
  cities: c.citiesSummary,
}));

export function ServiceAreaSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 md:py-24">
      <div className="container">
        <div 
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            We Go Far for Good Junk
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            50 miles of junk removal range. Think of us as clutter superheroes with a really big truck.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {counties.map((county, index) => (
            <div
              key={county.name}
              className={`p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-card-foreground">{county.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{county.cities}</p>
            </div>
          ))}
        </div>

        <div 
          className={`text-center mt-10 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button asChild variant="outline">
            <Link to="/service-area">See Full Service Area</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

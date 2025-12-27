import { Link } from "react-router-dom";
import { Trash2, Refrigerator, TreeDeciduous, Home, HardHat, Building2, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const services = [
  {
    icon: Home,
    title: "Residential Junk Removal",
    description: "That 'perfectly good' couch you've been meaning to sell for 3 years? Time to let it go.",
  },
  {
    icon: Refrigerator,
    title: "Appliance Removal",
    description: "We'll wrestle that fridge down the stairs so you don't have to.",
  },
  {
    icon: TreeDeciduous,
    title: "Yard Waste & Debris",
    description: "Mother Nature's mess, met by our muscle.",
  },
  {
    icon: Trash2,
    title: "Garage & Estate Cleanouts",
    description: "We're not here to judge how you got here. We're just here to fix it.",
  },
  {
    icon: HardHat,
    title: "Construction Debris",
    description: "Contractors love us. Their job sites? Not so much (before we arrive).",
  },
  {
    icon: Building2,
    title: "Light Commercial",
    description: "Office furniture doesn't deserve a funeral. Just a quick, dignified exit.",
  },
  {
    icon: AlertTriangle,
    title: "Hazmat Pickup",
    description: "Paint, batteries, chemicals — we'll take them to proper disposal sites.",
  },
];

export function ServicesOverview() {
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
            We'll Haul Basically Anything
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Couches, fridges, that weird thing in your basement you're afraid to touch — we've seen it all, and we're not easily spooked.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group p-6 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
            >
              <service.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-card-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>

        <div 
          className={`text-center mt-10 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button asChild variant="outline">
            <Link to="/services">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

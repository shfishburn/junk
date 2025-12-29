import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation, useLoadingDelay } from "@/hooks";
import { ServiceCardSkeletonGrid } from "@/components/skeletons";
import residentialImg from "@/assets/service-residential.jpg";
import appliancesImg from "@/assets/service-appliances.jpg";
import yardWasteImg from "@/assets/service-yard-waste.jpg";
import cleanupsImg from "@/assets/service-cleanouts.jpg";
import constructionImg from "@/assets/service-construction.jpg";
import commercialImg from "@/assets/service-commercial.jpg";
import lightDemolitionImg from "@/assets/service-light-demolition.jpg";
import hazmatImg from "@/assets/service-hazmat.jpg";

const services = [
  {
    title: "Residential Junk Removal",
    description: "That 'perfectly good' couch you've been meaning to sell for 3 years? Time to let it go.",
    image: residentialImg,
  },
  {
    title: "Appliance Removal",
    description: "We'll wrestle that fridge down the stairs so you don't have to.",
    image: appliancesImg,
  },
  {
    title: "Yard Waste & Debris",
    description: "Mother Nature's mess, met by our muscle.",
    image: yardWasteImg,
  },
  {
    title: "Garage & Estate Cleanouts",
    description: "We're not here to judge how you got here. We're just here to fix it.",
    image: cleanupsImg,
  },
  {
    title: "Construction Debris",
    description: "Contractors love us. Their job sites? Not so much (before we arrive).",
    image: constructionImg,
  },
  {
    title: "Light Commercial",
    description: "Office furniture doesn't deserve a funeral. Just a quick, dignified exit.",
    image: commercialImg,
  },
  {
    title: "Light Demolition",
    description: "Decks, sheds, fences — we tear it down and haul it away. No drama.",
    image: lightDemolitionImg,
  },
  {
    title: "Hazardous Materials",
    description: "Paint, batteries, chemicals — we handle the scary stuff so you don't have to.",
    image: hazmatImg,
  },
];

export function ServicesOverview() {
  const { ref, isVisible } = useScrollAnimation();
  const isLoading = useLoadingDelay(300);

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

        {isLoading ? (
          <ServiceCardSkeletonGrid />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`group overflow-hidden rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-card-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

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

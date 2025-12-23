import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Refrigerator, TreeDeciduous, Home, HardHat, Building2, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import residentialImg from "@/assets/service-residential.jpg";

const services = [
  {
    icon: Home,
    title: "Residential Junk Removal",
    slug: "residential",
    description: "We remove unwanted items from your home quickly and responsibly.",
    image: residentialImg,
    details: [
      "Old furniture and mattresses",
      "Electronics and appliances",
      "Clothing and household goods",
      "Exercise equipment",
      "Kids' toys and playsets",
    ],
  },
  {
    icon: Refrigerator,
    title: "Appliance Removal",
    slug: "appliances",
    description: "Safe removal and responsible disposal of large household appliances.",
    image: null,
    details: [
      "Refrigerators and freezers",
      "Washers and dryers",
      "Stoves and ovens",
      "Dishwashers",
      "Water heaters and AC units",
    ],
  },
  {
    icon: TreeDeciduous,
    title: "Yard Waste & Debris",
    slug: "yard-waste",
    description: "Clean up your property with our yard waste removal services.",
    image: null,
    details: [
      "Branches and tree limbs",
      "Leaves and grass clippings",
      "Brush and shrub trimmings",
      "Soil and sod",
      "Storm debris",
    ],
  },
  {
    icon: Trash2,
    title: "Garage & Estate Cleanouts",
    slug: "cleanouts",
    description: "Complete cleanout services for garages, basements, attics, and estates.",
    image: null,
    details: [
      "Full garage cleanouts",
      "Basement and attic clearing",
      "Estate and foreclosure cleanouts",
      "Storage unit cleanouts",
      "Hoarding situations (handled with care)",
    ],
  },
  {
    icon: HardHat,
    title: "Construction & Renovation Debris",
    slug: "construction",
    description: "Keep your job site clean with our construction debris removal.",
    image: null,
    details: [
      "Drywall and lumber",
      "Flooring materials",
      "Roofing debris",
      "Demolition waste",
      "Renovation leftovers",
    ],
  },
  {
    icon: Building2,
    title: "Light Commercial Cleanouts",
    slug: "commercial",
    description: "Efficient junk removal for offices and small businesses.",
    image: null,
    details: [
      "Office furniture removal",
      "Cubicle and desk disposal",
      "Equipment and electronics",
      "Retail fixture removal",
      "Warehouse cleanouts",
    ],
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const { ref, isVisible } = useScrollAnimation();
  const isReversed = index % 2 === 1;

  return (
    <div
      ref={ref}
      id={service.slug}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center`}
    >
      <div 
        className={`transition-all duration-700 ${isReversed ? "lg:order-2" : ""} ${
          isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${isReversed ? "translate-x-8" : "-translate-x-8"}`
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <service.icon className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {service.title}
          </h2>
        </div>
        <p className="text-lg text-muted-foreground mb-6">
          {service.description}
        </p>
        <ul className="space-y-2 mb-6">
          {service.details.map((detail) => (
            <li key={detail} className="flex items-start gap-2 text-muted-foreground">
              <span className="text-primary mt-1">•</span>
              {detail}
            </li>
          ))}
        </ul>
        <Button asChild>
          <Link to="/contact">
            Get a Quote
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div 
        className={`rounded-lg aspect-[4/3] overflow-hidden border border-border transition-all duration-700 delay-200 ${
          isReversed ? "lg:order-1" : ""
        } ${isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${isReversed ? "-translate-x-8" : "translate-x-8"}`}`}
      >
        {service.image ? (
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-card flex items-center justify-center">
            <service.icon className="h-24 w-24 text-muted-foreground/30" />
          </div>
        )}
      </div>
    </div>
  );
}

const Services = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Junk Removal Services
            </h1>
            <p className="text-lg text-muted-foreground">
              From a single item to a complete property cleanout, we handle all types of junk removal in Mount Vernon and throughout the North Sound region.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="space-y-16">
            {services.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Don't See What You Need?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              We haul almost anything. Give us a call and we'll let you know if we can help.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;

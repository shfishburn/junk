import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import { SERVICE_AREA_DATA, CountyCard } from "@/components/ServiceAreaInfo";

const ServiceArea = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: mapRef, isVisible: mapVisible } = useScrollAnimation();

  return (
    <Layout>
      <SEO
        title="Service Area"
        description="Junk removal in Skagit, Whatcom, Snohomish & King Counties. Serving Mount Vernon, Bellingham, Everett, and surrounding areas within 50 miles."
        keywords="junk removal Skagit County, junk removal Whatcom County, junk removal Bellingham, junk removal Everett, service area"
        url="/service-area"
      />
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <div 
            ref={heroRef}
            className={`max-w-3xl transition-all duration-700 ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              We Go Far for Good Junk
            </h1>
            <p className="text-lg text-muted-foreground">
              Based in Marysville, we'll drive up to 50 miles to haul your stuff. Think of us as clutter superheroes with a really big truck and an unreasonable enthusiasm for making things disappear.
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div 
            ref={mapRef}
            className={`transition-all duration-700 delay-150 ${
              mapVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-6 text-center">
              Our 50-Mile Service Radius
            </h2>
            <ServiceAreaMap />
            <p className="text-center text-muted-foreground mt-4">
              Click the marker to see our location. We travel up to 50 miles for junk removal services.
            </p>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="space-y-12">
            {SERVICE_AREA_DATA.counties.map((county) => (
              <CountyCard key={county.name} county={county} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Not Sure If We Serve Your Area?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              We're optimistic people. Give us a ring — we might surprise you. And if we truly can't help, we'll point you to someone who can.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">Request a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="tel:+13606109233">
                  <Phone className="mr-2 h-4 w-4" />
                  (360) 610-9233
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceArea;

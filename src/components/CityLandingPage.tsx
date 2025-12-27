import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, CheckCircle, Truck, Clock, Shield, Recycle, Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export interface CityData {
  name: string;
  slug: string;
  county: string;
  tagline: string;
  description: string;
  neighborhoods: string[];
  landmarks: string[];
  localContext: string;
  coordinates: { lat: number; lng: number };
}

const services = [
  { name: "Residential Junk Removal", icon: Truck, description: "Furniture, appliances, and household items" },
  { name: "Yard Waste Hauling", icon: Recycle, description: "Branches, leaves, and landscaping debris" },
  { name: "Construction Debris", icon: Shield, description: "Drywall, lumber, and renovation waste" },
  { name: "Appliance Removal", icon: CheckCircle, description: "Old fridges, washers, and dryers" },
  { name: "Estate Cleanouts", icon: Clock, description: "Complete property clearing services" },
  { name: "Commercial Services", icon: Star, description: "Office and business junk removal" },
];

export function CityLandingPage({ city }: { city: CityData }) {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation();
  const { ref: whyRef, isVisible: whyVisible } = useScrollAnimation();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Junky Gurus",
    description: `Professional junk removal services in ${city.name}, WA. Same-day service available.`,
    url: `https://thejunkygurus.com/junk-removal-${city.slug}-wa`,
    telephone: "+1-360-610-9233",
    email: "thejunkygurus@gmail.com",
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: {
        "@type": "State",
        name: "Washington"
      }
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.coordinates.lat,
      longitude: city.coordinates.lng
    },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "16:00"
      }
    ]
  };

  return (
    <Layout>
      <SEO
        title={`Junk Removal in ${city.name}, WA`}
        description={`Professional junk removal in ${city.name}, ${city.county}. Same-day service, upfront pricing, eco-friendly disposal. Call (360) 610-9233 for a free quote.`}
        keywords={`junk removal ${city.name}, ${city.name} WA hauling, furniture removal ${city.name}, appliance removal ${city.name}, yard waste ${city.name}, ${city.county} junk removal`}
        url={`/junk-removal-${city.slug}-wa`}
      />
      
      {/* Inject structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-section-alt">
        <div className="container">
          <div 
            ref={heroRef}
            className={`max-w-3xl transition-all duration-700 ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/service-area" className="hover:text-primary transition-colors">Service Area</Link>
              <span>/</span>
              <span className="text-charcoal">{city.name}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Junk Removal in {city.name}, WA
            </h1>
            <p className="text-xl text-primary font-medium mb-4">{city.tagline}</p>
            <p className="text-lg text-muted-foreground mb-8">
              {city.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/book">Book Your Pickup</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:+13606109233">
                  <Phone className="mr-2 h-4 w-4" />
                  (360) 610-9233
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Local Focus */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div 
            ref={whyRef}
            className={`transition-all duration-700 ${
              whyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4 text-center">
              Why {city.name} Chooses Junky Gurus
            </h2>
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              {city.localContext}
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg border border-border bg-card">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">Same-Day Service</h3>
                <p className="text-muted-foreground">Call before noon, we'll be there today. {city.name} residents get priority scheduling.</p>
              </div>
              <div className="text-center p-6 rounded-lg border border-border bg-card">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">Upfront Pricing</h3>
                <p className="text-muted-foreground">No hidden fees or surprise charges. You see the price before we start loading.</p>
              </div>
              <div className="text-center p-6 rounded-lg border border-border bg-card">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Recycle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">Eco-Friendly</h3>
                <p className="text-muted-foreground">We donate and recycle whenever possible. Good for {city.name}, good for the planet.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-20 bg-section-alt">
        <div className="container">
          <div 
            ref={servicesRef}
            className={`transition-all duration-700 ${
              servicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4 text-center">
              Junk Removal Services in {city.name}
            </h2>
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              From single items to complete property cleanouts, we handle it all in {city.name} and throughout {city.county}.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.name} className="p-6 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
                  <service.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal mb-2">{service.name}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg">
                <Link to="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Areas Served */}
      <section className="py-16 md:py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4 text-center">
            {city.name} Areas We Serve
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-8">
            We provide junk removal throughout {city.name} and all surrounding neighborhoods.
          </p>
          
          <div className="max-w-4xl mx-auto">
            <div className="p-6 rounded-lg border border-border bg-card mb-8">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <h3 className="text-lg font-semibold text-charcoal">Neighborhoods & Areas</h3>
              </div>
              <div className="flex flex-wrap gap-2 ml-8">
                {city.neighborhoods.map((neighborhood) => (
                  <span
                    key={neighborhood}
                    className="px-3 py-1 text-sm bg-background border border-border rounded-full text-muted-foreground"
                  >
                    {neighborhood}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-6 rounded-lg border border-primary/30 bg-primary/5">
              <div className="flex items-start gap-3 mb-4">
                <Star className="h-5 w-5 text-primary mt-1" />
                <h3 className="text-lg font-semibold text-charcoal">Local Landmarks Near Our Service Area</h3>
              </div>
              <div className="flex flex-wrap gap-2 ml-8">
                {city.landmarks.map((landmark) => (
                  <span
                    key={landmark}
                    className="px-3 py-1 text-sm bg-primary/10 border border-primary/20 rounded-full text-charcoal"
                  >
                    {landmark}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 md:py-20 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Transparent Pricing for {city.name}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We charge by volume, not by item. See our pricing guide or get a free estimate with our AI tool.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/pricing">View Pricing</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/ai-estimator">Get Your Real Price</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Clear the Clutter in {city.name}?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Book online in 60 seconds or call us for a free quote. Same-day service available for {city.name} residents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/book">Book Now</Link>
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
}

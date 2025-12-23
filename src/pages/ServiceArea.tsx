import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";

const areas = [
  {
    county: "Skagit County",
    description: "Our home base. We know Skagit County inside and out and offer the fastest response times here.",
    cities: [
      "Mount Vernon",
      "Burlington",
      "Anacortes",
      "Sedro-Woolley",
      "La Conner",
      "Concrete",
      "Bow",
      "Edison",
    ],
    highlight: true,
  },
  {
    county: "Whatcom County",
    description: "From Bellingham to the Canadian border, we provide reliable junk removal throughout Whatcom County.",
    cities: [
      "Bellingham",
      "Lynden",
      "Ferndale",
      "Blaine",
      "Everson",
      "Sumas",
      "Nooksack",
      "Birch Bay",
    ],
    highlight: false,
  },
  {
    county: "Snohomish County",
    description: "We serve northern Snohomish County with the same commitment to quality and fair pricing.",
    cities: [
      "Everett",
      "Marysville",
      "Lake Stevens",
      "Arlington",
      "Stanwood",
      "Granite Falls",
      "Snohomish",
      "Tulalip",
    ],
    highlight: false,
  },
  {
    county: "King County",
    description: "We extend our services to northern King County for larger projects and commercial work.",
    cities: [
      "Shoreline",
      "Kenmore",
      "Bothell",
      "Woodinville",
      "North Seattle",
      "Lake Forest Park",
      "Mountlake Terrace",
      "Edmonds",
    ],
    highlight: false,
  },
];

const ServiceArea = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Junk Removal Service Area
            </h1>
            <p className="text-lg text-muted-foreground">
              Based in Mount Vernon, Washington, we proudly serve Skagit, Whatcom, Snohomish, and King Counties. No job is too small or too far.
            </p>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="space-y-12">
            {areas.map((area) => (
              <div
                key={area.county}
                className={`p-8 rounded-lg border ${
                  area.highlight
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className={`h-6 w-6 mt-1 ${area.highlight ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-charcoal">
                      {area.county}
                      {area.highlight && (
                        <span className="ml-3 text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          Home Base
                        </span>
                      )}
                    </h2>
                    <p className="text-lg text-muted-foreground mt-2">
                      {area.description}
                    </p>
                  </div>
                </div>
                <div className="ml-9">
                  <h3 className="font-semibold text-charcoal mb-3">Cities We Serve:</h3>
                  <div className="flex flex-wrap gap-2">
                    {area.cities.map((city) => (
                      <span
                        key={city}
                        className="px-3 py-1 text-sm bg-background border border-border rounded-full text-muted-foreground"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
              Give us a call. If we can't help, we'll point you in the right direction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">Request a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="tel:+13605551234">
                  <Phone className="mr-2 h-4 w-4" />
                  (360) 555-1234
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

import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Refrigerator, TreeDeciduous, Home, HardHat, Building2, ArrowRight, Hammer, AlertTriangle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";
import { HazmatBookingForm } from "@/components/HazmatBookingForm";
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
    icon: Home,
    title: "Residential Junk Removal",
    slug: "residential",
    description: "That 'perfectly good' couch you've been meaning to sell for 3 years? Time to let it go. We'll handle it with care (and zero judgment).",
    image: residentialImg,
    details: [
      "Old furniture and mattresses",
      "Electronics and appliances",
      "Clothing and household goods",
      "Exercise equipment (we see you, unused treadmill)",
      "Kids' toys and playsets",
    ],
  },
  {
    icon: Refrigerator,
    title: "Appliance Removal",
    slug: "appliances",
    description: "We'll wrestle that fridge down the stairs so you don't have to. Your back will thank us later.",
    image: appliancesImg,
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
    description: "Mother Nature's mess, met by our muscle. Storm knocked down a tree? We've got you.",
    image: yardWasteImg,
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
    description: "We're not here to judge how you got here. We're just here to fix it — one truckload at a time.",
    image: cleanupsImg,
    details: [
      "Full garage cleanouts",
      "Basement and attic clearing",
      "Estate and foreclosure cleanouts",
      "Storage unit cleanouts",
      "Hoarding situations (handled with compassion)",
    ],
  },
  {
    icon: HardHat,
    title: "Construction & Renovation Debris",
    slug: "construction",
    description: "Contractors love us. Their job sites? Not so much (before we arrive, anyway).",
    image: constructionImg,
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
    description: "Office furniture doesn't deserve a funeral. Just a quick, dignified exit. We'll make it happen.",
    image: commercialImg,
    details: [
      "Office furniture removal",
      "Cubicle and desk disposal",
      "Equipment and electronics",
      "Retail fixture removal",
      "Warehouse cleanouts",
    ],
  },
  {
    icon: Hammer,
    title: "Light Demolition",
    slug: "light-demolition",
    description: "Need something torn down? We'll knock it out (literally) and haul away every last piece.",
    image: lightDemolitionImg,
    details: [
      "Deck and patio removal",
      "Shed and playhouse teardown",
      "Fence removal",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Hazardous Materials Pickup",
    slug: "hazmat-pickup",
    description: "Got old paint cans staring at you? Batteries multiplying in a drawer? We'll pick them up and deliver them to the proper disposal sites so you don't have to figure out where they go.",
    image: hazmatImg,
    details: [
      "Latex & oil-based paint",
      "Household chemicals & cleaners",
      "Batteries (all types)",
      "Fluorescent bulbs & CFLs",
      "Motor oil & antifreeze",
      "Electronics & e-waste",
      "Aerosol cans",
      "Propane tanks",
    ],
  },
];

const hazmatFaqs = [
  {
    question: "What hazardous materials do you accept?",
    answer: "We accept common household hazardous materials including latex and oil-based paints, household chemicals and cleaners, all types of batteries, fluorescent bulbs and CFLs, motor oil and antifreeze, electronics and e-waste, aerosol cans, and small propane tanks."
  },
  {
    question: "What items do you NOT accept?",
    answer: "We cannot accept explosives, ammunition, radioactive materials, medical waste, biohazardous materials, asbestos, or industrial chemicals. These require specialized disposal services. If you're unsure about an item, give us a call and we'll let you know."
  },
  {
    question: "Do you need special permits for hazmat pickup?",
    answer: "No! That's the beauty of our service. We pick up household hazardous materials and transport them to certified collection facilities on your behalf. We handle the logistics so you don't have to figure out where these items go or wait for special collection days."
  },
  {
    question: "How does the hazmat pickup service work?",
    answer: "It's simple: schedule a pickup, we arrive and safely collect your hazardous materials, then we transport them to the appropriate certified collection facility for proper disposal. You get peace of mind knowing everything is handled responsibly."
  },
  {
    question: "Are there quantity limits for hazardous materials?",
    answer: "For most household quantities, there are no limits. However, if you have an unusually large amount of hazardous materials (like clearing out a workshop or business), give us a call first so we can plan accordingly and provide an accurate quote."
  },
  {
    question: "Is hazmat pickup available same-day?",
    answer: "In most cases, yes! We try to accommodate same-day hazmat pickups whenever possible. Just give us a call and we'll do our best to fit you into our schedule."
  },
  {
    question: "How should I prepare hazardous materials for pickup?",
    answer: "Keep items in their original containers when possible. Make sure lids are secure and containers aren't leaking. If you have loose batteries, put them in a bag or box. We'll handle the rest — no need to stress about perfect packaging."
  },
];

const SITE_URL = "https://junkygurus.com";

// Individual Service Schema for each service
const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": services.map((service, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Service",
      "@id": `${SITE_URL}/services#${service.slug}`,
      "name": service.title,
      "description": service.description,
      "provider": {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        "name": "Junky Gurus LLC"
      },
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 48.4201,
          "longitude": -122.3343
        },
        "geoRadius": "80467"
      },
      "serviceType": service.title,
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "USD"
        }
      }
    }
  }))
};

const hazmatFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": hazmatFaqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

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
      <SEO
        title="Junk Removal Services"
        description="Residential junk removal, appliance hauling, yard waste, estate cleanouts, construction debris, hazardous materials pickup, and commercial cleanouts in Mount Vernon, WA and the Puget Sound Region."
        keywords="junk removal services, appliance removal, furniture hauling, estate cleanout, construction debris, yard waste removal, hazardous materials pickup, paint disposal, battery recycling"
        url="/services"
        pageType="services-list"
        pagePurpose="Complete list of junk removal services offered. Includes residential, commercial, appliances, yard waste, construction debris, light demolition, and hazmat pickup."
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(servicesSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(hazmatFaqSchema)}
        </script>
      </Helmet>
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <Breadcrumbs items={[{ label: "Services" }]} />
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              We Haul It All (Seriously, Try Us)
            </h1>
            <p className="text-lg text-muted-foreground">
              From one sad couch to a garage that hasn't seen daylight since 2003, we handle all types of junk removal across the Puget Sound Region. Challenge us.
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

      {/* Hazmat FAQ Section */}
      <section className="py-16 md:py-24 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <AlertTriangle className="h-4 w-4" />
                Hazardous Materials FAQ
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Questions About Hazmat Pickup?
              </h2>
              <p className="text-muted-foreground">
                We get it — hazardous materials can be confusing. Here's what you need to know.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {hazmatFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Hazmat Booking Form */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <HazmatBookingForm />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Got Something Weird? We're Intrigued.
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              We've hauled hot tubs, pianos, and things we still can't identify. Give us a call — we love a good mystery.
            </p>
            <Button asChild size="lg" className="bg-on-primary text-primary hover:bg-on-primary/90">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;

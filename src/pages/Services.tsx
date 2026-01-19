import { Layout } from "@/components/layout";
import { SEO, Breadcrumbs } from "@/components/shared";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Refrigerator, TreeDeciduous, Home, HardHat, Building2, ArrowRight, Hammer, AlertTriangle, Check, Clock, DollarSign, Recycle, Heart, MessageSquare, Landmark, Shield, FileCheck, Award, TrashIcon } from "lucide-react";
import { useScrollAnimation } from "@/hooks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";
import { HazmatBookingForm } from "@/components/features";
import { CurbSubscriptionForm } from "@/components/CurbSubscriptionForm";
import residentialImg from "@/assets/service-residential.jpg";
import appliancesImg from "@/assets/service-appliances.jpg";
import yardWasteImg from "@/assets/service-yard-waste.jpg";
import cleanupsImg from "@/assets/service-cleanouts.jpg";
import constructionImg from "@/assets/service-construction.jpg";
import commercialImg from "@/assets/service-commercial.jpg";
import lightDemolitionImg from "@/assets/service-light-demolition.jpg";
import hazmatImg from "@/assets/service-hazmat.jpg";
import trashToCurbImg from "@/assets/service-trash-to-curb.jpg";
import somethingElseImg from "@/assets/service-something-else.jpg";

const services = [
  {
    icon: Home,
    title: "Residential Junk Removal",
    slug: "residential",
    description: "Tired of staring at that furniture you've been 'meaning to sell' for years? We'll take it off your hands—no judgment, no hassle, no mystery fees.",
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
    description: "Dreading the thought of moving that fridge yourself? We'll wrestle it down the stairs, load it up, and recycle it properly—you don't lift a finger.",
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
    description: "Storm damage piling up? City won't take it curbside? We haul branches, debris, and yard waste so you're not stuck waiting for the next 'special collection day.'",
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
    description: "Overwhelmed by a garage, basement, or estate that's gotten out of hand? We're not here to judge. We're here to help—one truckload at a time, with pricing you'll know upfront.",
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
    description: "Job site buried in debris and the dumpster's already full? We clear construction waste fast so your project stays on schedule—with a price you'll know before we arrive.",
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
    title: "Commercial Cleanouts",
    slug: "commercial",
    description: "Office move? Closing down? That furniture won't vanish on its own. We handle commercial cleanouts efficiently—show up when scheduled, no corporate runaround.",
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
    description: "Got a deck, shed, or fence that needs to go? We'll tear it down and haul it away—no rental dumpsters, no weekend project, no surprises.",
    image: lightDemolitionImg,
    details: [
      "Deck and patio removal",
      "Shed and playhouse teardown",
      "Fence removal",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Household Hazmat Pickup",
    slug: "hazmat-pickup",
    description: "Confused about where to take old paint, batteries, or chemicals? Skip the research and the 'special disposal days.' We pick up common household hazardous materials and deliver them where they need to go—so you don't have to figure it out.",
    image: hazmatImg,
    details: [
      "Latex & oil-based paint",
      "Household chemicals & cleaners",
      "Batteries (all types)",
      "Fluorescent bulbs & CFLs",
      "Motor oil & antifreeze",
      "Electronics & e-waste",
      "Aerosol cans",
      "Propane tanks (small)",
    ],
    note: "We handle household quantities. Industrial chemicals, asbestos, and medical waste require specialized services—ask us and we'll point you in the right direction.",
  },
  {
    icon: TrashIcon,
    title: "Trash Can to Curb",
    slug: "trash-to-curb",
    description: "Can't make it to the curb on trash day? Recovering from surgery, dealing with mobility issues, or just too busy? We'll wheel your bins out and back—so you never miss a pickup.",
    image: trashToCurbImg,
    details: [
      "Weekly or bi-weekly service available",
      "Trash, recycling & yard waste bins",
      "Ideal for seniors and those with mobility challenges",
      "Perfect for busy professionals and travelers",
      "We bring bins back to your garage or storage area",
    ],
    isCurbService: true,
  },
  {
    icon: MessageSquare,
    title: "Something Else?",
    slug: "something-else",
    description: "Got something weird? Something we didn't list? We've probably seen weirder. Give us a call or shoot us a message—we'll figure it out together.",
    image: somethingElseImg,
    details: [
      "Unusual or oversized items",
      "One-off pickups you can't categorize",
      "Questions about what we can take",
      "Custom requests and special situations",
    ],
    isContactCTA: true,
  },
];

const trustCallouts = [
  { icon: DollarSign, text: "Upfront pricing—what we quote is what you pay" },
  { icon: Clock, text: "Reliable scheduling—we show up when we say we will" },
  { icon: Recycle, text: "Responsible disposal—donate, recycle, landfill last" },
  { icon: Check, text: "No on-site upsells or surprise fees" },
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
        {'note' in service && service.note && (
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mb-6 border border-border">
            <strong>Note:</strong> {service.note}
          </p>
        )}
        {'isContactCTA' in service && service.isContactCTA ? (
          <Button asChild>
            <Link to="/contact">
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : 'isCurbService' in service && service.isCurbService ? (
          <Button asChild>
            <a href="#curb-pricing">
              See Pricing & Sign Up
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button asChild>
            <Link to="/ai-estimator">
              Know Your Price
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
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
        description="Junk removal services in Mount Vernon, WA with no hidden fees and reliable scheduling. Residential, commercial, appliances, yard waste, construction debris, and hazmat pickup. Know your price first."
        keywords="junk removal services, appliance removal, furniture hauling, estate cleanout, construction debris, yard waste removal, hazardous materials pickup, paint disposal, battery recycling, no hidden fees"
        url="/services"
        pageType="services-list"
        pagePurpose="Complete list of junk removal services offered. Includes residential, commercial, appliances, yard waste, construction debris, light demolition, and hazmat pickup. All services include upfront pricing with no hidden fees."
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
              Junk Removal Without the Runaround
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              No hidden fees. No vague arrival windows. No mystery charges when we show up. Just honest pricing, reliable scheduling, and responsible disposal—from a local team that actually shows up.
            </p>
          </div>
          
          {/* Trust Callout */}
          <div className="mt-8 p-6 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Every Service Includes:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {trustCallouts.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
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

      {/* Trash Can to Curb Subscription Pricing */}
      <section id="curb-pricing" className="py-16 md:py-24 bg-section-alt scroll-mt-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <TrashIcon className="h-4 w-4" />
                Subscription Service
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Trash Can to Curb Plans
              </h2>
              <p className="text-lg text-muted-foreground">
                Never worry about trash day again. We handle your bins so you don't have to.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* One-Time Service */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">One-Time Service</h3>
                <p className="text-muted-foreground mb-6">For travelers & occasional needs</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">$15</span>
                  <span className="text-muted-foreground">/One-Time</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Single trash day coverage</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Trash, recycling & yard waste bins</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Bins returned to garage/storage</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Book as needed — no commitment</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contact">Book Now</Link>
                </Button>
              </div>

              {/* Weekly Plan */}
              <div className="bg-card border-2 border-primary rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  BEST VALUE
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Weekly Service</h3>
                <p className="text-muted-foreground mb-6">Perfect for busy households</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">$40</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Weekly curb service (4x/month)</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Trash, recycling & yard waste bins</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Bins returned to garage/storage</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>No contracts — cancel anytime</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link to="/contact">Get Started</Link>
                </Button>
              </div>

              {/* Bi-Weekly Plan */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Bi-Weekly Service</h3>
                <p className="text-muted-foreground mb-6">Great for smaller households</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">$25</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Bi-weekly curb service (2x/month)</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Trash, recycling & yard waste bins</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Bins returned to garage/storage</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>No contracts — cancel anytime</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contact">Get Started</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trash Can to Curb FAQ */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <TrashIcon className="h-4 w-4" />
                Trash Can to Curb FAQ
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Questions About Trash Can to Curb?
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about our bin service.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="curb-1" className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                  What bins do you take to the curb?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  We handle all your curbside bins — trash, recycling, and yard waste. If you have multiple bins, we'll take them all out and bring them back in.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="curb-2" className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                  When do you take out and return the bins?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  We take your bins to the curb the morning of your scheduled trash day (before pickup) and return them to your garage or designated storage area the same day after the truck comes through.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="curb-3" className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                  How do I cancel or pause my subscription?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  No contracts means no hassle. Just give us a call or text and we'll pause or cancel your service immediately. You can restart anytime — we'll be here.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="curb-4" className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                  What if I'm going on vacation and need extra coverage?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Our One-Time Service is perfect for this. Book individual pickups for the weeks you'll be away. Or if you're already a subscriber, we've got you covered automatically.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="curb-5" className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                  Do you serve my area?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  We serve Mount Vernon, Burlington, Sedro-Woolley, Anacortes, La Conner, Bow, and surrounding Skagit County communities. Not sure? Give us a call and we'll let you know.
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>
        </div>
      </section>

      {/* Trash Can to Curb Signup Form */}
      <section className="py-16 md:py-24 bg-section-alt">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <CurbSubscriptionForm />
          </div>
        </div>
      </section>

      {/* Government & Commercial Contracts Section */}
      <section className="py-16 md:py-24 bg-section-alt">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Landmark className="h-4 w-4" />
                Government & Commercial
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Federal & Commercial Contract Services
              </h2>
              <p className="text-lg text-muted-foreground">
                SAM.gov registered and ready to serve government agencies, military installations, and commercial enterprises throughout the Pacific Northwest.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">SAM.gov Registered</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Fully registered in the System for Award Management (SAM.gov) and ready to bid on federal contracts. Our UEI and NAICS codes are on file and current.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">NAICS Certified</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Certified under NAICS codes 562111 (Solid Waste Collection), 562119 (Other Waste Collection), and 238910 (Site Preparation) for all junk removal and light demolition services.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Government Facilities</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Experience with military base cleanouts, federal office debris removal, and post-construction cleanup for government projects. Cleared and ready to work on secure sites.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Small Business Ready</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Eligible for small business set-aside contracts and micro-purchases (under $10K). Perfect for quick-turnaround projects that need reliable local service.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Contract Services We Provide:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Military base cleanouts & debris removal",
                  "Federal building waste management",
                  "Post-construction cleanup",
                  "Disaster debris removal (FEMA eligible)",
                  "Office relocation waste services",
                  "Secure document/equipment destruction hauling",
                  "Ongoing facility maintenance contracts",
                  "Emergency response cleanups"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Ready to discuss a government or commercial contract? Contact our team for quotes, capability statements, or to discuss your project requirements.
              </p>
              <Button asChild size="lg">
                <Link to="/contact">
                  Request Contract Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Not Sure What You've Got? We'll Figure It Out.
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Upload a photo for an instant estimate—or just give us a call. No sales pitch, no pressure. Just answers.
            </p>
            <Button asChild size="lg" className="bg-on-primary text-primary hover:bg-on-primary/90">
              <Link to="/ai-estimator">Get Your Price</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;

import { useState } from "react";
import { Layout } from "@/components/layout";
import { SEO, Breadcrumbs, DiscountBadge } from "@/components/shared";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Truck, CheckCircle2, Sparkles, Camera, Sofa, Tv, Refrigerator, Armchair, BedDouble, Package, HardHat, AlertTriangle, Heart, Hammer } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JunkAnalyzer, DemolitionAnalyzer } from "@/components/features";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";

const steps = [
  {
    icon: MessageSquare,
    step: "1",
    title: "Tell Us About Your Junk",
    description: "Give us a call or fill out the form. Don't be shy — we've heard it all. Describe your pile of shame and we'll figure out the rest.",
  },
  {
    icon: Truck,
    step: "2",
    title: "We Show Up & Quote You",
    description: "We come to you and give you a real price, not some bait-and-switch nonsense. If it doesn't work for you, no hard feelings.",
  },
  {
    icon: CheckCircle2,
    step: "3",
    title: "Say Yes & It's Gone",
    description: "Say the magic word ('yes') and we get to work. Often same-day. Watch your junk disappear and feel the weight lift off your shoulders.",
  },
];

const singleItemPricing = [
  { item: "Couch / Sofa", price: "$75 – $150", icon: Sofa },
  { item: "Mattress / Box Spring", price: "$50 – $100", icon: BedDouble },
  { item: "Recliner / Armchair", price: "$50 – $85", icon: Armchair },
  { item: "TV (any size)", price: "$35 – $75", icon: Tv },
  { item: "Refrigerator / Freezer", price: "$75 – $125", icon: Refrigerator },
  { item: "Washer / Dryer (each)", price: "$65 – $100", icon: Package },
  { item: "Desk / Table", price: "$50 – $100", icon: Package },
  { item: "Treadmill / Exercise Bike", price: "$75 – $125", icon: Package },
  { item: "Hot Tub", price: "$300 – $500", icon: Package },
  { item: "Piano", price: "$200 – $400", icon: Package },
];

const truckLoadPricing = [
  { load: "Minimum Load", description: "A few small items (1-2 pieces)", price: "$125 – $190" },
  { load: "1/8 Truck Load", description: "A couple items like a chair + TV", price: "$190 – $250" },
  { load: "1/4 Truck Load", description: "Small room cleanout or a few furniture pieces", price: "$250 – $375" },
  { load: "1/2 Truck Load", description: "Garage cleanout or bedroom furniture set", price: "$375 – $500" },
  { load: "3/4 Truck Load", description: "Large room or multiple rooms", price: "$500 – $625" },
  { load: "Full Truck Load", description: "Whole house or estate cleanout", price: "$625 – $815" },
];

const constructionMaterialPricing = [
  { material: "Drywall / Sheetrock", description: "Per sheet or small pile", price: "$15 – $30 per sheet" },
  { material: "Lumber / Wood Scraps", description: "Framing, plywood, boards", price: "$75 – $200" },
  { material: "Concrete / Brick", description: "Heavy materials (weight-based)", price: "$150 – $400" },
  { material: "Tile / Flooring", description: "Ceramic, vinyl, laminate (weight-based)", price: "$100 – $250" },
  { material: "Insulation", description: "Fiberglass, foam, or blown-in", price: "$100 – $200" },
  { material: "Mixed Construction Debris", description: "Remodel or demo waste", price: "$200 – $500" },
];

const hazmatPricing = [
  { item: "Paint (per 5-gallon bucket)", description: "Latex or oil-based", price: "$25 – $40" },
  { item: "Paint (per gallon can)", description: "Latex or oil-based", price: "$10 – $15" },
  { item: "Household Chemicals", description: "Cleaners, solvents, etc.", price: "$15 – $30" },
  { item: "Batteries (bag/box)", description: "All types", price: "$15 – $25" },
  { item: "Fluorescent Tubes / CFLs", description: "Bulbs and tubes", price: "$10 – $20" },
  { item: "Motor Oil / Antifreeze", description: "Per container", price: "$15 – $25" },
  { item: "E-Waste (TV, computer)", description: "Electronics", price: "$25 – $75" },
  { item: "Propane Tanks", description: "Small to medium", price: "$20 – $35" },
  { item: "Mixed Hazardous Load", description: "Multiple items", price: "$75 – $150+" },
];

const pricingInfo = [
  {
    title: "Volume-Based Pricing",
    description: "We charge based on how much space your stuff takes in our truck. Small pile = small price. Big pile = bigger price. Rocket science, this is not.",
  },
  {
    title: "No Hidden Fees",
    description: "The price we quote is the price you pay. No extra charges for stairs, fuel surcharges, or 'disposal fees.' We hate that stuff too.",
  },
  {
    title: "Free Estimates",
    description: "Not sure what it'll cost? Neither are we until we see it! That's why we give free, no-pressure estimates. Worst case, you get a number. Best case, your junk is gone.",
  },
];

const faqs = [
  {
    question: "Do you offer any discounts?",
    answer: "Yes! We offer a 15% discount for seniors (65+) and veterans. No paperwork required—just let us know when you book or when we arrive. It's our way of saying thanks for your service to our country and community."
  },
  {
    question: "How much does junk removal cost?",
    answer: "Our pricing is volume-based, meaning you pay for how much space your items take in our truck. A single item like a couch might cost $75-150, while a full truckload ranges from $400-600. We provide free, no-obligation estimates so you know exactly what to expect."
  },
  {
    question: "Do you offer free estimates?",
    answer: "Yes! We offer completely free, no-pressure estimates. We'll come to your location, assess your junk, and give you an upfront price. If it doesn't work for you, no hard feelings."
  },
  {
    question: "Are there any hidden fees?",
    answer: "Absolutely not. The price we quote is the price you pay. We don't add sneaky surcharges, fuel fees, or mysterious 'processing fees.' What you see is what you get."
  },
  {
    question: "What affects the price of junk removal?",
    answer: "Four main factors affect pricing: 1) Volume - how much space your junk takes in our truck, 2) Weight - heavy items like concrete may cost more, 3) Location - inside pickup vs. curbside, and 4) Special items - hazardous materials or items requiring special disposal."
  },
  {
    question: "Do you offer same-day junk removal?",
    answer: "Yes, we often can provide same-day service depending on our schedule. Give us a call and we'll do our best to accommodate your timeline."
  },
  {
    question: "What items do you remove?",
    answer: "We remove almost everything including furniture, appliances, electronics, yard waste, construction debris, and more. We handle residential, commercial, and estate cleanouts. Some hazardous materials may require special handling."
  },
  {
    question: "What areas do you serve?",
    answer: "We're based in Mount Vernon, WA and serve Skagit, Whatcom, Snohomish, and northern King Counties. We travel up to 50 miles for junk removal services."
  },
  {
    question: "Do you recycle or donate items?",
    answer: "Yes! We're committed to responsible disposal. We donate usable items to local charities, recycle what we can, and only landfill items that absolutely have to go."
  },
  {
    question: "Do you take hazardous materials?",
    answer: "Yes! We offer a household hazardous materials pickup service for common items like paint, batteries, household chemicals, motor oil, and e-waste. We pick them up and deliver to certified collection facilities. Note: We cannot accept explosives, medical waste, asbestos, or industrial chemicals—those require specialized services. Not sure about something? Just ask."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

const Pricing = () => {
  return (
    <Layout>
      <SEO
        title="Pricing & How It Works"
        description="Transparent junk removal pricing in Mount Vernon, WA. Volume-based pricing, no hidden fees, free estimates. Get an instant AI quote!"
        keywords="junk removal pricing, junk removal cost, Mount Vernon hauling prices, free estimate"
        url="/pricing"
        pageType="pricing"
        pagePurpose="Pricing information for junk removal services. Volume-based truck load pricing from $125-$750. Single item prices. AI photo estimator available."
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      {/* Hero */}
      <section className="py-12 md:py-16 lg:py-20 bg-section-alt">
        <div className="container max-w-6xl">
          <Breadcrumbs items={[{ label: "Pricing" }]} />
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-4 md:mb-5 leading-tight">
              Transparent Pricing (No Surprise Fees, We Promise)
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed max-w-2xl">
              We're bad at math, but we're great at being upfront. Here's how our pricing works — no gimmicks, no bait-and-switch.
            </p>
            <DiscountBadge variant="banner" />
          </div>
        </div>
      </section>

      {/* AI Estimator Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-6xl">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                New! AI-Powered Estimates
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal mb-3 md:mb-4 leading-tight">
                Too Lazy to Describe It? Just Show Us.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Snap a photo and our AI will estimate the cost. It's seen some things. It won't judge.
              </p>
            </div>
            
            <Tabs defaultValue="junk" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="junk" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Junk Removal
                </TabsTrigger>
                <TabsTrigger value="demolition" className="flex items-center gap-2">
                  <Hammer className="h-4 w-4" />
                  Light Demolition
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="junk">
                <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-card border border-border shadow-lg">
                  <JunkAnalyzer />
                </div>
              </TabsContent>
              
              <TabsContent value="demolition">
                <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-card border border-border shadow-lg">
                  <DemolitionAnalyzer />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container max-w-6xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal text-center mb-8 md:mb-12 leading-tight">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative inline-flex items-center justify-center w-14 md:w-16 h-14 md:h-16 rounded-full bg-primary/10 mb-4 md:mb-6">
                  <step.icon className="h-7 md:h-8 w-7 md:w-8 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-2 md:mb-3 leading-snug">{step.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Sheet */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-section-alt">
        <div className="container max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal mb-3 md:mb-4 leading-tight">
              Pricing Guide
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Here's a ballpark of what things cost. Final prices depend on weight, location, and other factors — but this gives you a solid idea.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Single Item Pricing */}
            <div className="bg-background rounded-xl border border-border overflow-hidden">
              <div className="p-6 bg-primary/5 border-b border-border">
                <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Single Item Removal
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Common items we haul away</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Item</TableHead>
                    <TableHead className="text-right font-semibold">Price Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {singleItemPricing.map((item) => (
                    <TableRow key={item.item}>
                      <TableCell className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        {item.item}
                      </TableCell>
                      <TableCell className="text-right font-medium text-primary">{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Truck Load Pricing */}
            <div className="bg-background rounded-xl border border-border overflow-hidden">
              <div className="p-6 bg-primary/5 border-b border-border">
                <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Truck Load Pricing
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Based on volume in our truck</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Load Size</TableHead>
                    <TableHead className="text-right font-semibold">Price Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {truckLoadPricing.map((load) => (
                    <TableRow key={load.load}>
                      <TableCell>
                        <div>
                          <span className="font-medium">{load.load}</span>
                          <p className="text-xs text-muted-foreground">{load.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-primary">{load.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Construction Material Pricing */}
          <div className="mt-8 bg-background rounded-xl border border-border overflow-hidden">
            <div className="p-6 bg-primary/5 border-b border-border">
              <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
                <HardHat className="h-5 w-5 text-primary" />
                Construction Material Removal
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Debris from remodels, demos, and construction projects</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Material</TableHead>
                  <TableHead className="text-right font-semibold">Price Range</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {constructionMaterialPricing.map((item) => (
                  <TableRow key={item.material}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{item.material}</span>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-primary">{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Hazardous Materials Pricing */}
          <div className="mt-8 bg-background rounded-xl border border-border overflow-hidden">
            <div className="p-6 bg-primary/5 border-b border-border">
              <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Household Hazmat Pickup
              </h3>
              <p className="text-sm text-muted-foreground mt-1">We pick up common household hazardous items and deliver to certified facilities</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Item</TableHead>
                  <TableHead className="text-right font-semibold">Price Range</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hazmatPricing.map((item) => (
                  <TableRow key={item.item}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{item.item}</span>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-primary">{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 bg-muted/50 border-t border-border">
              <p className="text-xs text-muted-foreground">
                * Pricing includes pickup, transport, and disposal fees. We handle household quantities. Industrial chemicals, asbestos, and medical waste require specialized services—just ask and we'll point you in the right direction.
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            * Prices are estimates and may vary based on weight, location, and accessibility. Get a free quote for exact pricing.
          </p>
        </div>
      </section>

      {/* Pricing Philosophy */}
      <section className="py-16 md:py-24 bg-section-alt">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
            Our Pricing Promise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingInfo.map((info) => (
              <div key={info.title} className="p-6 rounded-lg bg-background border border-border">
                <h3 className="text-xl font-semibold text-charcoal mb-3">{info.title}</h3>
                <p className="text-muted-foreground">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Affects Price */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-8">
              What Affects Your Price?
            </h2>
            <div className="space-y-4 text-charcoal-light">
              <p>
                Our pricing is straightforward: <strong className="text-charcoal">the more space your junk takes in our truck, the more it costs.</strong> We measure in fractions of a truckload.
              </p>
              <p>
                A few things can affect your price:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-charcoal">Volume:</strong> A single sofa costs less than a garage full of stuff.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-charcoal">Weight:</strong> Heavy items like concrete or dirt may have a small additional cost.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-charcoal">Location:</strong> Inside your home vs. curbside pickup.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-charcoal">Special items:</strong> Hazardous materials or items requiring special disposal.</span>
                </li>
              </ul>
              <p className="pt-4">
                The best way to get an accurate price? <strong className="text-charcoal">Just give us a call.</strong> We'll ask a few questions and often can give you a ballpark over the phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group p-6 rounded-lg bg-background border border-border"
                >
                  <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-charcoal">
                    {faq.question}
                    <span className="ml-4 flex-shrink-0 text-primary transition-transform group-open:rotate-180">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Out the Damage?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Get a free quote. No obligation, no sales pitch, just straight talk from people who really, really like hauling junk.
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

export default Pricing;

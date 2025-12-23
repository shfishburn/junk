import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Truck, CheckCircle2, Sparkles, Camera } from "lucide-react";
import { JunkAnalyzer } from "@/components/JunkAnalyzer";

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

const pricingInfo = [
  {
    title: "Volume-Based Pricing",
    description: "We charge based on how much space your stuff takes in our truck. Small pile = small price. Big pile = bigger price. Rocket science, this is not.",
  },
  {
    title: "No Hidden Fees",
    description: "The price we quote is the price you pay. We don't add sneaky surcharges or mysterious 'processing fees.' We hate that stuff too.",
  },
  {
    title: "Free Estimates",
    description: "Not sure what it'll cost? Neither are we until we see it! That's why we give free, no-pressure estimates. Worst case, you get a number. Best case, your junk is gone.",
  },
];

const Pricing = () => {
  return (
    <Layout>
      <SEO
        title="Pricing & How It Works"
        description="Transparent junk removal pricing in Mount Vernon, WA. Volume-based pricing, no hidden fees, free estimates. Get an instant AI quote!"
        keywords="junk removal pricing, junk removal cost, Mount Vernon hauling prices, free estimate"
        url="/pricing"
      />
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Transparent Pricing (No Surprise Fees, We Promise)
            </h1>
            <p className="text-lg text-muted-foreground">
              We're bad at math, but we're great at being upfront. Here's how our pricing works — no gimmicks, no bait-and-switch.
            </p>
          </div>
        </div>
      </section>

      {/* AI Estimator Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                New! AI-Powered Estimates
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
                Too Lazy to Describe It? Just Show Us.
              </h2>
              <p className="text-muted-foreground">
                Snap a photo of your junk pile and our AI will estimate the cost. It's seen some things. It won't judge.
              </p>
            </div>
            
            <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-lg">
              <JunkAnalyzer />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <step.icon className="h-8 w-8 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
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

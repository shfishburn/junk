import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Truck, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "1",
    title: "Contact Us",
    description: "Give us a call or fill out our contact form. Tell us what you need hauled and we'll set up a time that works for you.",
  },
  {
    icon: Truck,
    step: "2",
    title: "On-Site Estimate",
    description: "We'll come to your location and give you an upfront, honest price based on the volume of junk. No hidden fees, no surprises.",
  },
  {
    icon: CheckCircle2,
    step: "3",
    title: "Same-Day Removal",
    description: "Approve the price and we get to work immediately. We'll haul, load, and clean up — often the same day you call.",
  },
];

const pricingInfo = [
  {
    title: "Volume-Based Pricing",
    description: "We charge based on how much space your items take in our truck. A single item costs less than a full load. It's that simple.",
  },
  {
    title: "No Hidden Fees",
    description: "The price we quote is the price you pay. We don't add fuel surcharges, labor fees, or surprise costs after the fact.",
  },
  {
    title: "Free Estimates",
    description: "Not sure how much it'll cost? We'll give you a free, no-obligation estimate on-site. If it doesn't work for you, no hard feelings.",
  },
];

const Pricing = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Simple, Honest Pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              We believe in transparent pricing. No gimmicks, no bait-and-switch. You'll know exactly what you're paying before we start.
            </p>
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
              Get Your Free Quote
            </h2>
            <p className="text-lg opacity-90 mb-8">
              No obligation, no pressure. Just honest pricing for honest work.
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

export default Pricing;

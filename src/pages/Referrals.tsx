import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ReferralWidget } from "@/components/ReferralWidget";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, DollarSign, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "Share Your Link",
    description: "Send your unique referral link to friends, family, or that neighbor with the overflowing garage.",
  },
  {
    icon: Sparkles,
    title: "They Book & Save",
    description: "Your friend gets 10% off their first junk removal. Everyone loves a deal.",
  },
  {
    icon: DollarSign,
    title: "You Get Rewarded",
    description: "When they complete their booking, you get $25 off your next haul. Cha-ching!",
  },
];

const Referrals = () => {
  return (
    <Layout>
      <SEO
        title="Refer a Friend | Junk Karma Rewards"
        description="Share the junk love! Refer friends to Junky Gurus and get $25 off your next booking. They get 10% off too. Win-win!"
        keywords="junk removal referral, refer a friend, junk karma, discount junk removal"
        url="/referrals"
      />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Junk Karma Rewards
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal">
              Share the Love,<br />Ditch the Junk
            </h1>
            <p className="text-lg text-muted-foreground">
              Got friends drowning in clutter? Be their hero. You'll both save money, 
              and we'll handle the heavy lifting. That's what we call junk karma.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal text-center mb-12">
            How Junk Karma Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
                )}
                
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold md:left-1/2 md:translate-x-8">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-charcoal text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral widget */}
      <section className="py-16 md:py-24 bg-section-alt">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-lg">
              <ReferralWidget variant="full" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Fine print */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-charcoal text-center">
              The Fine Print (Don't Worry, It's Short)
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-charcoal">Who can I refer?</strong><br />
                Anyone who hasn't used Junky Gurus before. Friends, family, coworkers, 
                that guy you met at a party who mentioned his garage...
              </p>
              <p>
                <strong className="text-charcoal">When do I get my reward?</strong><br />
                Your $25 credit is applied after your friend completes their first booking 
                and we haul their junk away. We'll email you when it's ready to use.
              </p>
              <p>
                <strong className="text-charcoal">Is there a limit?</strong><br />
                Nope! Refer as many friends as you want. Each one that books earns you $25. 
                Some folks have basically gotten free cleanouts this way.
              </p>
              <p>
                <strong className="text-charcoal">What if I have questions?</strong><br />
                Hit us up! Call, text, or email. We're friendly, we promise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">
              Ready to Get Your Junk On?
            </h2>
            <p className="text-primary-foreground/80">
              Whether you're here to book or just share the love, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">
                  Book a Pickup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/ai-estimator">
                  Get AI Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Referrals;

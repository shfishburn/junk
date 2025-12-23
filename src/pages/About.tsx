import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Recycle, Users, Shield } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Respect for Your Property",
    description: "We treat your home like our own. Careful handling, clean work, and no damage — that's our standard.",
  },
  {
    icon: Recycle,
    title: "Responsible Disposal",
    description: "We don't just dump everything. We donate usable items, recycle what we can, and dispose of the rest properly.",
  },
  {
    icon: Users,
    title: "Local & Personal",
    description: "We're your neighbors in Mount Vernon. When you call, you talk to us — not a call center.",
  },
  {
    icon: Shield,
    title: "Reliable & Trustworthy",
    description: "We show up when we say we will, do what we say we'll do, and charge what we quote. Simple as that.",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              About Junky Gurus
            </h1>
            <p className="text-lg text-muted-foreground">
              We're a locally owned junk removal company based in Mount Vernon, Washington. We believe in hard work, honest pricing, and treating people right.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-charcoal-light text-lg">
              <p>
                Junky Gurus started with a simple idea: junk removal shouldn't be complicated, expensive, or stressful.
              </p>
              <p>
                We've seen how other companies operate — hidden fees, no-show appointments, careless workers who leave messes behind. That's not us.
              </p>
              <p>
                We're based right here in Mount Vernon, and we serve the communities we live in. When you hire us, you're hiring your neighbors. We take pride in that.
              </p>
              <p>
                Whether you need one old couch hauled away or an entire estate cleaned out, we bring the same level of care and professionalism to every job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-section-alt">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="flex gap-4 p-6 rounded-lg bg-background border border-border">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-charcoal mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-6">
              Part of the Community
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're more than a junk removal company. We're invested in making Mount Vernon and the North Sound a better place to live. We support local charities, donate usable items to those in need, and work hard to keep our environmental impact as low as possible.
            </p>
            <Button asChild>
              <Link to="/contact">Work With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Let us take the junk off your hands. Honest pricing, reliable service, local people.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Get a Free Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

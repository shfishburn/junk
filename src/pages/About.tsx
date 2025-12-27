import { Layout } from "@/components/layout";
import { SEO, Breadcrumbs } from "@/components/shared";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Recycle, Users, Shield } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Respect for Your Property",
    description: "We treat your home like it's our mom's house. (Hi, Mom!)",
  },
  {
    icon: Recycle,
    title: "Responsible Disposal",
    description: "We don't just dump everything. We donate, recycle, and only landfill what absolutely has to go. Mother Earth approves.",
  },
  {
    icon: Users,
    title: "Local & Personal",
    description: "We're your neighbors. When you call, you get us — not a robot, not a call center, just real humans who care.",
  },
  {
    icon: Shield,
    title: "Reliable & Trustworthy",
    description: "We show up when we say we will. Revolutionary, we know.",
  },
];

const About = () => {
  return (
    <Layout>
      <SEO
        title="About Us"
        description="Junky Gurus is a locally owned junk removal company in Mount Vernon, WA. We believe in hard work, honest pricing, and responsible disposal."
        keywords="about junky gurus, Mount Vernon junk removal, local junk removal company, responsible disposal"
        url="/about"
      />
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <Breadcrumbs items={[{ label: "About" }]} />
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              The Junk-Obsessed Humans Behind the Truck
            </h1>
            <p className="text-lg text-muted-foreground">
              We're a locally owned junk removal company based in Mount Vernon, Washington. We believe in hard work, honest pricing, and the deep satisfaction of making clutter disappear.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-6">
              How We Got Into the Junk Business
            </h2>
            <div className="space-y-4 text-charcoal-light text-lg">
              <p>
                Junky Gurus started because we got tired of seeing people get ripped off by junk removal companies. Hidden fees? No-shows? Workers who leave your place messier than they found it? Hard pass.
              </p>
              <p>
                We figured there had to be a better way. Spoiler alert: there is, and you're looking at it.
              </p>
              <p>
                We're based right here in Mount Vernon, and we serve the communities we live in. When you hire us, you're hiring your neighbors — folks who actually care whether your driveway gets scratched.
              </p>
              <p>
                Whether you need one sad, lonely couch hauled away or an entire estate that's been collecting "treasures" since 1987, we bring the same level of enthusiasm to every job. Yes, we said enthusiasm. We're weird like that.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-section-alt">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
            Our Guiding Principles (We Actually Follow These)
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
              More Than Just Haulers
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're invested in making Mount Vernon and the Puget Sound Region a better place to live. We donate usable items to those in need and recycle like our planet depends on it (because it does). Basically, we're trying to be the junk removal company your grandma would be proud of.
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
              Ready to Reclaim Your Space?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Your junk is our jam. Let's make some magic happen (by which we mean: making your stuff disappear).
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

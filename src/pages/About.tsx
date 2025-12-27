import { Layout } from "@/components/layout";
import { SEO, Breadcrumbs } from "@/components/shared";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Recycle, Users, Shield, XCircle, CheckCircle, Clock, Award, DollarSign } from "lucide-react";

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

const promises = [
  { text: "Upfront pricing—what we quote is what you pay", positive: true },
  { text: "Reliable scheduling—we show up when we say we will", positive: true },
  { text: "Responsible disposal—donate, recycle, landfill last", positive: true },
  { text: "15% off for seniors & veterans", positive: true },
];

const antiPromises = [
  "Hidden fees or 'oh, that's extra' surprises",
  "No-shows or vague arrival windows",
  "Pushy upsells when we arrive",
  "Corporate runaround when something goes wrong",
];

const stats = [
  { value: "500+", label: "Jobs Completed" },
  { value: "4.9★", label: "Customer Rating" },
  { value: "Same Day", label: "Service Available" },
];

const About = () => {
  return (
    <Layout>
      <SEO
        title="About Us"
        description="Junky Gurus is a locally owned junk removal company in Mount Vernon, WA. We believe in hard work, honest pricing, and responsible disposal. 15% discount for seniors and veterans."
        keywords="about junky gurus, Mount Vernon junk removal, local junk removal company, responsible disposal, senior discount, veteran discount"
        url="/about"
      />
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <Breadcrumbs items={[{ label: "About" }]} />
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              The Junk-Obsessed Humans Behind the Truck
            </h1>
            <p className="text-lg text-muted-foreground">
              We're a locally owned junk removal company based in Mount Vernon, Washington. We believe in hard work, honest pricing, and the deep satisfaction of making clutter disappear.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-10 max-w-xl">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-lg bg-card border border-border">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promises */}
      <section className="py-12 md:py-16 bg-primary/5 border-y border-primary/10">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Our Promises to You
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {promises.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-primary/20"
                >
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold text-foreground text-center mb-4">
              What You Won't Get From Us
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {antiPromises.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-destructive/20 text-sm text-muted-foreground"
                >
                  <XCircle className="h-4 w-4 text-destructive/60 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              How We Got Into the Junk Business
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                Junky Gurus started when four friends with perfectly good day jobs looked around and said, "You know what? We could do this better." We'd all had our own nightmare experiences with junk removal—hidden fees, no-shows, workers who left places messier than they found them. Hard pass.
              </p>
              <p>
                So we pooled our skills, bought a truck, and built a company based on one simple idea: treat people the way we'd want to be treated. Revolutionary, we know.
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
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
                  <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Senior & Veteran Discount Highlight */}
      <section className="py-12 md:py-16 bg-primary/10 border-y border-primary/20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              <Heart className="h-4 w-4" />
              Honoring Those Who Serve
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              15% Off for Seniors & Veterans
            </h2>
            <p className="text-muted-foreground mb-6">
              We're proud to honor those who've served our country and community. Seniors 65+ and veterans of any military branch get 15% off every service. No paperwork, no proof required—we trust you.
            </p>
            <Button asChild variant="outline">
              <Link to="/discounts">View All Discounts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
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

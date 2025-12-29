import { Layout } from "@/components/layout";
import { SEO, Breadcrumbs } from "@/components/shared";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Recycle, Users, Shield, XCircle, CheckCircle, Sparkles, Accessibility, Bot, Home, Trash2 } from "lucide-react";
import oldReliableTruck from "@/assets/old-reliable-truck.jpg";
import habitatRestoreLogo from "@/assets/habitat-restore-logo.png";
import mountVernonTulips from "@/assets/mount-vernon-tulips.jpg";
import aboutCtaBg from "@/assets/about-cta-bg.jpg";

const values = [
  {
    icon: Heart,
    title: "Respect for Your Property",
    description: "We treat your home like it's our mom's house. (Hi, Mom!)",
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

const disposalPathways = [
  {
    icon: Home,
    title: "Donate",
    description: "Usable furniture, appliances, and household items go to Habitat for Humanity ReStore and local charities—giving your stuff a second life.",
    priority: "First Choice",
  },
  {
    icon: Recycle,
    title: "Recycle",
    description: "Metals, electronics, cardboard, and recyclables go to proper facilities. We sort it so the planet doesn't pay the price.",
    priority: "Second Choice",
  },
  {
    icon: Trash2,
    title: "Dispose Responsibly",
    description: "Only what truly can't be reused or recycled goes to the landfill. It's always our last resort, never our first.",
    priority: "Last Resort",
  },
];

const promises = [
  { text: "Upfront pricing—what we quote is what you pay", positive: true },
  { text: "Reliable scheduling—we show up when we say we will", positive: true },
  { text: "Eco-conscious disposal—your junk deserves better than a landfill", positive: true },
  { text: "15% off for seniors & veterans", positive: true },
];

const antiPromises = [
  "Hidden fees or 'oh, that's extra' surprises",
  "No-shows or vague arrival windows",
  "Pushy upsells when we arrive",
  "Corporate runaround when something goes wrong",
];

const stats = [
  
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
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
            
            {/* Old Reliable */}
            <div>
              <div className="rounded-xl overflow-hidden border border-border shadow-lg">
                <img 
                  src={oldReliableTruck} 
                  alt="Old Reliable - our 1991 Ford Super Duty dump truck" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="font-semibold text-foreground">"Old Reliable"</p>
                <p className="text-sm text-muted-foreground">1991 Ford Super Duty</p>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* Where Your Junk Actually Goes */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Recycle className="h-4 w-4" />
              Environmental Responsibility
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Where Your Junk Actually Goes
            </h2>
            <p className="text-lg text-muted-foreground">
              We don't just haul your stuff to the nearest landfill and call it a day. Every item we pick up goes through our disposal hierarchy—because what happens after we leave matters just as much as how we treat your home.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {disposalPathways.map((pathway, index) => (
              <div 
                key={pathway.title} 
                className="relative p-6 rounded-xl bg-card border border-border text-center"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  {pathway.priority}
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mt-2 mb-4">
                  <pathway.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{pathway.title}</h3>
                <p className="text-muted-foreground text-sm">{pathway.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-10 flex flex-col items-center gap-4">
            <a 
              href="https://www.habitat.org/restores" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block transition-opacity hover:opacity-80"
            >
              <img 
                src={habitatRestoreLogo} 
                alt="Habitat for Humanity ReStore logo" 
                className="h-16 md:h-20 w-auto"
              />
            </a>
            <p className="text-muted-foreground text-sm">
              Proud partner — helping build homes and hope in our community.
            </p>
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

      {/* Technology Investment */}
      <section className="py-16 md:py-24 bg-card border-y border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Excellence End to End
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              More Than Just Hauling Junk
            </h2>
            <p className="text-lg text-muted-foreground">
              From AI-powered estimates to accessible design to responsible disposal—we obsess over every detail because you deserve better than "good enough." That's why we've invested in technology that makes everything easier, faster, and more accessible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-background border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Estimates</h3>
              <p className="text-muted-foreground">
                Upload a photo and get an instant price estimate. No waiting around, no guessing games. Our AI technology analyzes your junk and gives you a real number in seconds—before we even arrive.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-background border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Accessibility className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Accessible to Everyone</h3>
              <p className="text-muted-foreground">
                Our website is built with accessibility in mind—screen reader support, keyboard navigation, reduced motion options, and high-contrast design. Because everyone deserves a great experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-xl overflow-hidden border border-border shadow-lg">
                <img 
                  src={mountVernonTulips} 
                  alt="Skagit Valley tulip fields near Mount Vernon, Washington" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                Skagit Valley — our beautiful backyard
              </p>
            </div>
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Rooted in Mount Vernon
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We live here. We work here. Every dollar you spend with us stays in the community—supporting local families, local businesses, and local causes. We're the junk removal company your grandma would be proud of.
              </p>
              <Button asChild>
                <Link to="/contact">Work With Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${aboutCtaBg})` }}
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center text-primary-foreground">
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

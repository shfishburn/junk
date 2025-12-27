import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Users, Percent, Gift, Calendar, CheckCircle } from "lucide-react";

const discounts = [
  {
    id: "senior-veteran",
    icon: Heart,
    title: "Senior & Veteran Discount",
    discount: "15% Off",
    description: "We're proud to honor those who've served our country and community.",
    eligibility: [
      "Seniors aged 65 and older",
      "Veterans of any military branch",
      "Active-duty military personnel",
    ],
    howToClaim: "Just let us know when you book or when we arrive. No paperwork, no proof required—we trust you.",
    color: "primary",
  },
  {
    id: "referral",
    icon: Users,
    title: "Referral Reward",
    discount: "$25 Off",
    description: "Know someone with junk? You both win when you spread the word.",
    eligibility: [
      "Any customer who refers a friend or family member",
      "The referred person must complete a paid service",
    ],
    howToClaim: "Share your unique referral link or have your friend mention your name when booking. You'll both get $25 off your next service.",
    link: "/referrals",
    linkText: "Get Your Referral Link",
    color: "secondary",
  },
  {
    id: "repeat",
    icon: Calendar,
    title: "Repeat Customer Appreciation",
    discount: "10% Off",
    description: "Loyalty deserves recognition. Come back and save.",
    eligibility: [
      "Customers who have used our services before",
      "Applies to your second booking and beyond",
    ],
    howToClaim: "We keep track of our customers. Just book again and we'll automatically apply your discount.",
    color: "accent",
  },
];

export default function Discounts() {
  return (
    <Layout>
      <SEO
        title="Discounts & Savings | Junky Gurus"
        description="Save on junk removal with Junky Gurus. 15% off for seniors and veterans, $25 referral rewards, and repeat customer discounts. Serving Whatcom & Skagit County."
        keywords="junk removal discounts, senior discount, veteran discount, referral program, Bellingham junk removal deals"
      />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Percent className="h-4 w-4" />
              Ways to Save
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Discounts That Actually Matter
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Fair pricing is our foundation. But for those who've served, those who spread the word, 
              and those who keep coming back—we go further.
            </p>
          </div>
        </div>
      </section>

      {/* Discounts Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 md:gap-12">
            {discounts.map((discount, index) => (
              <div
                key={discount.id}
                className="relative rounded-2xl border border-border bg-card p-8 md:p-10 overflow-hidden"
              >
                {/* Background accent */}
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full bg-${discount.color}/5 -translate-y-1/2 translate-x-1/2 blur-3xl`} />
                
                <div className="relative grid md:grid-cols-[1fr,auto] gap-8 items-start">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center`}>
                        <discount.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {discount.title}
                        </h2>
                        <span className="text-lg font-semibold text-primary">
                          {discount.discount}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6">
                      {discount.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                          Who Qualifies
                        </h3>
                        <ul className="space-y-2">
                          {discount.eligibility.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                          How to Claim
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {discount.howToClaim}
                        </p>
                      </div>
                    </div>
                  </div>

                  {discount.link && (
                    <div className="md:self-center">
                      <Button asChild size="lg">
                        <Link to={discount.link}>
                          {discount.linkText}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stacking Note */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <Gift className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Can Discounts Be Combined?
            </h2>
            <p className="text-muted-foreground">
              We apply the best available discount to your order. While discounts can't be stacked, 
              we'll always make sure you get the biggest savings you qualify for.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Clear the Clutter?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get an instant estimate and see your savings before we even arrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/ai-estimator">Get Your Free Estimate</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/book">Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

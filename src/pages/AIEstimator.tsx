import { Layout } from "@/components/layout/Layout";
import { JunkAnalyzer } from "@/components/JunkAnalyzer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Camera, Lightbulb, Ruler, Eye } from "lucide-react";

const tips = [
  {
    icon: Lightbulb,
    title: "Good Lighting",
    description: "Natural light works best. Avoid harsh shadows.",
  },
  {
    icon: Ruler,
    title: "Show Scale",
    description: "Include something for size reference if possible.",
  },
  {
    icon: Eye,
    title: "Capture Everything",
    description: "Make sure all items are visible in the frame.",
  },
];

const AIEstimator = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 md:py-20 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Camera className="h-4 w-4" />
              AI-Powered Estimates
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Snap It. Know It. Junk It.
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload a photo of your junk pile and our AI will give you an instant estimate. 
              It's like having a junk removal guru in your pocket (minus the heavy lifting).
            </p>
          </div>
        </div>
      </section>

      {/* Analyzer Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <JunkAnalyzer />
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 md:py-24 bg-section-alt">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal text-center mb-8">
              Tips for the Best Estimate
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tips.map((tip) => (
                <div
                  key={tip.title}
                  className="p-6 rounded-xl bg-card border border-border text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <tip.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-charcoal mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-4">
              Prefer to Talk to a Human?
            </h2>
            <p className="text-muted-foreground mb-8">
              No problem! Give us a call or fill out our contact form. 
              We're real people who genuinely love talking about junk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
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

export default AIEstimator;
